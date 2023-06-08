package com.swp490_g2.hrms.common.utils;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Objects;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class DateUtils {

    private static final Logger LOGGER = LoggerFactory.getLogger(DateUtils.class);

    public static final String TIMEZONE = "Asia/Ho_Chi_Minh";
    public static final String DATE_FORMAT_1 = "dd-MM-yyyy";
    public static final String DATE_FORMAT_2 = "dd/MM/yyyy";
    public static final String DATE_FORMAT_3 = "yyyy-MM-dd";
    public static final String DATETIME_FORMAT = "dd/MM/yyyy HH:mm:ss";
    public static final String DATETIME_FORMAT_CUSTOM = "yyyy-MM-dd HH:mm:ss";

    public static final int TOTAL_DATE_IN_MONTH = 30;

    public static Date now() {
        return new Date();
    }

    public static String format(Date date, String format) {
        if (Objects.isNull(date)) return "";
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        formatter.setLenient(false);
        return formatter.format(date);
    }

    public static Date parse(String date, String format) {
        try {
            SimpleDateFormat formatter = new SimpleDateFormat(format);
            formatter.setLenient(false);
            return formatter.parse(date);
        } catch (ParseException e) {
            LOGGER.error("Can not parse date, details: {}", e.getMessage());
            return null;
        }
    }

    public static Date parse(String date) {
        return parse(date, DATE_FORMAT_3);
    }

    public static LocalDateTime toLocalDateTime(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    public static LocalDate toLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    public static int monthsBetween(Date d1, Date d2){
        return (int) ChronoUnit.MONTHS.between(toLocalDate(d2).withDayOfMonth(1),
                toLocalDate(d1).withDayOfMonth(1));
    }

    public static int monthsBetween(String d1, String d2){
        return (int) ChronoUnit.MONTHS.between(toLocalDate(Objects.requireNonNull(parse(d1, DATE_FORMAT_3))).withDayOfMonth(1),
                toLocalDate(Objects.requireNonNull(parse(d2, DATE_FORMAT_3))).withDayOfMonth(1));
    }

    public static Date monthsCalculate(Date date, Long months) {
        var process = toLocalDate(date);
        if (months < 0) return of(process.minusMonths(-months));

        if (months > 0) return of(process.plusMonths(months));

        return date;
    }

    public static Date toDate(LocalDateTime dateToConvert) {
        return Date.from(dateToConvert.atZone(ZoneId.systemDefault())
                        .toInstant());
    }

    public static Date of(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date of(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

    public static Date at(LocalDate localDate, LocalTime time) {
        return Date.from(localDate.atTime(time).atZone(ZoneId.systemDefault()).toInstant());
    }

    public static LocalTime toLocalTime(String s) {
        try {
            String[] splitted = s.split(":");
            return LocalTime.of(Integer.parseInt(splitted[0]), Integer.parseInt(splitted[1]));
        } catch (Exception e) {
            return null;
        }
    }
}
