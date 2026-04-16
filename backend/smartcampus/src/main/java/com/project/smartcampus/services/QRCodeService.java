//SandaniChamoda-it3030-paf-2026-smart-campus-group57\backend\smartcampus\src\main\java\com\project\smartcampus\services\QRCodeService.java
package com.project.smartcampus.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.project.smartcampus.entity.Booking;
import org.springframework.stereotype.Service;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class QRCodeService {
    
     public String generateQRCode(Booking booking) {

        try {
            String data = buildQrPayload(booking);

            QRCodeWriter writer = new QRCodeWriter();

            BitMatrix matrix =
                writer.encode(
                    data,
                    BarcodeFormat.QR_CODE,
                    200,
                    200
                );

            Path outputDir =
                Paths.get(
                    "src",
                    "main",
                    "resources",
                    "static",
                    "qr"
                );

            Files.createDirectories(outputDir);

            Path path =
                outputDir.resolve(
                    "qr_" + booking.getId() + ".png"
                );

            MatrixToImageWriter.writeToPath(
                matrix,
                "PNG",
                path
            );

            return "qr/qr_" + booking.getId() + ".png";

        } catch (Exception e) {

            throw new RuntimeException(
                "QR generation failed"
            );

        }

    }

    private String buildQrPayload(Booking booking) {
        return String.join(
            "\n",
            "ID: " + valueOrNa(booking.getId()),
            "Resource: " + valueOrNa(booking.getResourceName()),
            "Purpose: " + valueOrNa(booking.getPurpose()),
            "Booked By: " + valueOrNa(booking.getBookedBy()),
            "Attendees: " + valueOrNa(booking.getAttendees()),
            "Start: " + valueOrNa(booking.getStartTime()),
            "End: " + valueOrNa(booking.getEndTime()),
            "Status: " + valueOrNa(statusSafe(booking)),
            "Checked In: " + valueOrNa(booking.getCheckedInTime()),
            "Rejection Reason: " + valueOrNa(booking.getRejectionReason())
        );
    }

    private String statusSafe(Booking booking) {
        if (booking.getStatus() == null) {
            return null;
        }
        return booking.getStatus().name();
    }

    private String valueOrNa(Object value) {
        return value == null ? "N/A" : value.toString();
    }
}
