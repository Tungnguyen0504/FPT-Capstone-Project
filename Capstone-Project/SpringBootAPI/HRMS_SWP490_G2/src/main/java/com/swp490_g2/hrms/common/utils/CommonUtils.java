package com.swp490_g2.hrms.common.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class CommonUtils {
    public static Double haversine_distance(Double lat1, Double lng1, Double lat2, Double lng2) {
        double R = 6371.0710;
        double rlat1 = lat1 * (Math.PI / 180);
        double rlat2 = lat2 * (Math.PI / 180);
        double difflat = rlat2 - rlat1;
        double difflon = (lng2 - lng1) * (Math.PI / 180);

        return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2)
                + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    }

    public static Long toLong(Object object) {
        String stringToConvert = String.valueOf(object);
        return Long.parseLong(stringToConvert);
    }
}