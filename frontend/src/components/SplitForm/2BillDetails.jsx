import { useState, useEffect, useMemo, useRef } from "react";
import { useSplit } from "../../context/SplitContext";
import { useEnterToAdvance } from "../../hooks/useEnterToAdvance";
import styles from "../../scss/components/Steps.module.scss";

const Step2 = ({ nextStep, prevStep }) => {
    const { formData, updateForm } = useSplit();
    const fileInputRef = useRef(null);
    const LOCAL_STORAGE_KEY = "equipay_uploaded_receipt";
    const [uploadedImage, setUploadedImage] = useState(null);
    const [parsing, setParsing] = useState(false);
    const [parseError, setParseError] = useState(null);
    const [parseSucceeded, setParseSucceeded] = useState(false);
    const [lastFile, setLastFile] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", quantity: "1", totalAmount: "" });
    const [editingItemId, setEditingItemId] = useState(null);
    const handleEnterAdvance = useEnterToAdvance();

    const resetItemForm = () => {
        setNewItem({ name: "", quantity: "1", totalAmount: "" });
        setEditingItemId(null);
    };

    const buildUnitSplits = (item, quantity) => {
        const unitSplits = Array.isArray(item.unitSplits) ? item.unitSplits : [];
        return Array.from({ length: quantity }, (_, index) => {
            const split = unitSplits[index];
            const assignedTo = Array.isArray(split?.assignedTo)
                ? split.assignedTo
                : index === 0 && Array.isArray(item.assignedTo)
                    ? item.assignedTo
                    : [];
            return { assignedTo };
        });
    };

    const handleSaveItem = () => {
        const quantity = parseInt(newItem.quantity, 10);
        const totalAmount = parseFloat(newItem.totalAmount);
        if (!newItem.name || Number.isNaN(quantity) || quantity < 1 || Number.isNaN(totalAmount)) {
            return;
        }

        if (editingItemId) {
            updateForm({
                items: formData.items.map((item) =>
                    item.id === editingItemId
                        ? {
                            ...item,
                            name: newItem.name.trim(),
                            quantity,
                            totalAmount,
                            splitMode: item.splitMode || "counts",
                            unitSplits: buildUnitSplits(item, quantity),
                        }
                        : item
                ),
            });
            resetItemForm();
            return;
        }

        updateForm({
            items: [
                ...formData.items,
                {
                    id: Date.now(),
                    name: newItem.name.trim(),
                    quantity,
                    totalAmount,
                    splitMode: "counts",
                    unitSplits: Array.from({ length: quantity }, () => ({ assignedTo: [] })),
                },
            ],
        });
        resetItemForm();
    };

    const startEditItem = (item) => {
        setEditingItemId(item.id);
        setNewItem({
            name: item.name || "",
            quantity: String(item.quantity ?? 1),
            totalAmount: String(item.totalAmount ?? item.amount ?? ""),
        });
    };

    const removeItem = (itemId) => {
        updateForm({ items: formData.items.filter((item) => item.id !== itemId) });
        if (editingItemId === itemId) {
            resetItemForm();
        }
    };

    const subtotal = useMemo(
        () =>
            formData.items.reduce(
                (sum, item) => sum + parseFloat(item.totalAmount ?? item.amount ?? 0),
                0
            ),
        [formData.items]
    );
    const total = useMemo(
        () => subtotal + parseFloat(formData.tax || 0) + parseFloat(formData.tip || 0),
        [subtotal, formData.tax, formData.tip]
    );
    
    useEffect(() => {
        updateForm({ subtotal });
    }, [subtotal, updateForm]);

    useEffect(() => {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (data) setUploadedImage(data);
        } catch {
            // ignore localStorage errors
        }
    }, []);

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!allowedTypes.includes(file.type) || file.type === "image/gif") {
            alert("Please select a standard image file (jpg or png). GIFs are not allowed.");
            e.target.value = "";
            return;
        }

        // store last file for possible retry
        setLastFile(file);
        // start parsing request (do in parallel with preview saving)
        setParsing(true);
        setParseError(null);
        setParseSucceeded(false);
        parseFile(file);

        // keep existing preview/localStorage behavior
        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target.result;
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, dataUrl);
            } catch {
                // ignore storage quota errors
            }
            setUploadedImage(dataUrl);
        };
        reader.readAsDataURL(file);
        // reset input so same file can be picked again later
        e.target.value = "";
    };

    const parseFile = async (file) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            if (!API_BASE_URL) {
                throw new Error("VITE_API_BASE_URL is not configured");
            }
            const fd = new FormData();
            fd.append("file", file);

            const resp = await fetch(`${API_BASE_URL}/api/v1/receipts/parse`, {
                method: "POST",
                body: fd,
            });

            if (!resp.ok) {
                const text = await resp.text().catch(() => "");
                const msg = `Server responded ${resp.status}: ${text}`;
                throw new Error(msg);
            }

            let data;
            try {
                data = await resp.json();
            } catch (jsonErr) {
                const text = await resp.text().catch(() => "(no body)");
                throw new Error(`Invalid JSON response: ${jsonErr.message} - body: ${text}`);
            }

            console.debug("Receipt parse response:", data);

            const parsedItems = Array.isArray(data.items)
                ? data.items.map((rItem, index) => {
                      const qty = Number(rItem.quantity ?? 1) || 1;
                      const totalAmt = Number(
                          rItem.totalPrice ?? (rItem.unitPrice != null && rItem.quantity != null
                              ? rItem.unitPrice * rItem.quantity
                              : 0)
                      ) || 0;
                      return {
                          id: (crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${index}`,
                          name: rItem.name ?? "",
                          quantity: qty,
                          totalAmount: totalAmt,
                          splitMode: "counts",
                          unitSplits: Array.from({ length: qty }, () => ({ assignedTo: [] })),
                      };
                  })
                : [];

            const payload = {
                items: parsedItems,
                subtotal: Number(data.subtotal ?? 0),
                tax: Number(data.tax ?? 0),
                tip: Number(data.tip ?? 0),
                totalAmount: Number(data.total ?? 0),
                date: data.receiptDate ?? formData.date,
            };

            updateForm(payload);
            setParseSucceeded(true);
            setParseError(null);
        } catch (err) {
            console.error("Receipt parse failed:", err);
            setParseError("Could not parse receipt. Please try again or enter items manually.");
            setParseSucceeded(false);
        } finally {
            setParsing(false);
        }
    };

    const handleRetry = () => {
        if (!lastFile) {
            setParseError("No file available to retry. Please re-upload the image.");
            return;
        }
        setParsing(true);
        setParseError(null);
        parseFile(lastFile);
    };

    const handleViewImage = () => {
        if (!uploadedImage) return;
        window.open(uploadedImage, "_blank");
    };

    const handleDeleteImage = () => {
        try {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        } catch {
            // ignore localStorage errors
        }
        setUploadedImage(null);
        setParseSucceeded(false);
        setLastFile(null);
        setParseError(null);
    };
    
    const handleNext = () => {
        updateForm({ 
            subtotal,
            totalAmount: total 
        });
        nextStep();
    };
    return (
        <div className={styles.card} data-enter-scope="true">
            <h2 className={styles.title}>Add Bill Details</h2>

            <label className={styles.label}>Upload Bill</label>
            <div className={styles.uploadArea}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    aria-hidden="true"
                />
                {!uploadedImage ? (
                    <>
                        <span>Upload Image here</span>
                        <button
                            type="button"
                            className={styles.btnUpload}
                            onClick={handleUploadClick}
                        >
                            Choose File
                        </button>
                    </>
                ) : (
                    <div className={styles.uploadPreview}>
                        <img
                            src={uploadedImage}
                            alt="Uploaded receipt"
                            style={{ maxWidth: 120, maxHeight: 80, objectFit: "cover", borderRadius: 4 }}
                        />
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <button type="button" className={styles.btnUpload} onClick={handleViewImage}>
                                View Image
                            </button>
                            {!parseSucceeded && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleDeleteImage}
                                        className={`${styles.itemActionBtn} ${styles.itemActionDelete}`}
                                        aria-label="Delete uploaded image"
                                        title="Delete"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    {parseError && (
                                        <button
                                            type="button"
                                            onClick={handleRetry}
                                            className={styles.btnGhost}
                                            disabled={parsing}
                                        >
                                            Retry
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {parsing && (
                <div style={{ marginTop: 8, color: "#0a66c2" }}>Parsing receipt...</div>
            )}
            {parseError && (
                <div style={{ marginTop: 8, color: "#b00020" }}>{parseError}</div>
            )}

            <label className={styles.label}>Manual Entry</label>
            {formData.items.map((item) => (
                <div key={item.id} className={styles.itemRow}>
                    <div className={styles.itemMeta}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemSubtext}>Qty {item.quantity ?? 1}</span>
                    </div>
                    <span className={styles.itemAmount}>
                        {(parseFloat(item.totalAmount ?? item.amount ?? 0)).toFixed(2)} Rs
                    </span>
                    <div className={styles.itemActions}>
                        <button
                            type="button"
                            onClick={() => startEditItem(item)}
                            className={styles.itemActionBtn}
                            aria-label="Edit item"
                            title="Edit"
                        >
                            <i className="fas fa-pen"></i>
                        </button>
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className={`${styles.itemActionBtn} ${styles.itemActionDelete}`}
                            aria-label="Delete item"
                            title="Delete"
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            ))}

            <div className={styles.addItemRow}>
                <input
                    type="text"
                    placeholder="Item Name"
                    className={styles.input}
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    className={`${styles.input} ${styles.quantityInput}`}
                    min="1"
                    step="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <input
                    type="number"
                    placeholder="Total Amount"
                    className={styles.input}
                    value={newItem.totalAmount}
                    onChange={(e) => setNewItem({ ...newItem, totalAmount: e.target.value })}
                    onKeyDown={handleEnterAdvance}
                />
                <div className={styles.addItemActions}>
                    <button type="button" onClick={handleSaveItem} className={styles.btnAdd}>
                        {editingItemId ? "Update" : "Add"}
                    </button>
                    {editingItemId && (
                        <button type="button" onClick={resetItemForm} className={styles.btnGhost}>
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.totalSection}>
                <div className={styles.totalRow}>
                    <span>Subtotal</span>
                    <span>{subtotal.toFixed(2)} Rs</span>
                </div>

                <div className={styles.taxTipRow}>
                    <div className={styles.taxTipItem}>
                        <p>Tax</p>
                        <input
                            type="number"
                            placeholder="Tax"
                            className={styles.input}
                            value={formData.tax}
                            onChange={(e) => updateForm({ tax: e.target.value })}
                            onKeyDown={handleEnterAdvance}
                            />
                        {/* <button type="button" className={styles.btnSmall}>
                                Add
                                </button> */}
                    </div>
                    <div className={styles.taxTipItem}>
                        <p>Tip</p>
                        <input
                            type="number"
                            placeholder="Tip"
                            className={styles.input}
                            value={formData.tip}
                            onChange={(e) => updateForm({ tip: e.target.value })}
                            onKeyDown={handleEnterAdvance}
                        />
                        {/* <button type="button" className={styles.btnSmall}>
                                Add
                        </button> */}
                    </div>
                </div>

                <div className={styles.totalRow}>
                    <span>Total Amount</span>
                    <span>{total.toFixed(2)} Rs</span>
                </div>
            </div>

            <div className={styles.btnRow}>
                <button type="button" onClick={prevStep} className={styles.btnSecondary}>
                    Back
                </button>
                <button type="button" onClick={handleNext} className={styles.btnPrimary} disabled={formData.items.length === 0}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Step2;