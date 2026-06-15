package com.equipay.dto.receipt;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Merchant {
    private String name;
    private String address;
    private String phone;
    private String gstNumber;
}
