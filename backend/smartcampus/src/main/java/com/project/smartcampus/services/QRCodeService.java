//SandaniChamoda-it3030-paf-2026-smart-campus-group57\backend\smartcampus\src\main\java\com\project\smartcampus\services\QRCodeService.java
package com.project.smartcampus.services;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class QRCodeService {
    
     public String generateQRCode(Long bookingId) {

        try {

            String data =
    "http://192.168.8.102:5173/verify/"
    + bookingId;

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
                    "qr_" + bookingId + ".png"
                );

            MatrixToImageWriter.writeToPath(
                matrix,
                "PNG",
                path
            );

            return "qr/qr_" + bookingId + ".png";

        } catch (Exception e) {

            throw new RuntimeException(
                "QR generation failed"
            );

        }

    }
}
