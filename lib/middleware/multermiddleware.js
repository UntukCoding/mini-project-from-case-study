import multer from "multer";

export const multermiddleware=(err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Error spesifik dari Multer (misal: file terlalu besar)
        return res.status(400).json({ status: 'error', message: err.message });
    } else if (err) {
        // Error lain (misal: tipe file tidak valid dari fileFilter)
        return res.status(400).json({ status: 'error', message: err.message });
    }
    next();
}