const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Record = require('../models/Record');

const router = express.Router();

// Multer setup for CSV file upload
const upload = multer({ dest: 'uploads/' });

/** ------------------------------
 * ✅ 1. ADD SINGLE RECORD
 * ------------------------------ */
router.post('/', async(req, res) => {
    try {
        const { accession_no, extension_name, subject, year } = req.body;

        // Simple validation
        if (!accession_no || !extension_name || !subject || !year) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newRecord = new Record({
            accession_no,
            extension_name,
            subject,
            year: parseInt(year),
        });

        await newRecord.save();
        res.status(201).json({ message: 'Record created', record: newRecord });
    } catch (error) {
        console.error('Error creating record:', error);
        res.status(500).json({ message: 'Error creating record', error: error.message });
    }
});

/** ------------------------------
 * ✅ 2. GET RECORDS WITH PAGINATION
 * ------------------------------ */
router.get('/', async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const records = await Record.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Record.countDocuments();

        res.json({
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            totalRecords: total,
            records,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching records', error: error.message });
    }
});

/** ------------------------------
 * ✅ 3. GET SINGLE RECORD BY ID
 * ------------------------------ */
router.get('/:id', async(req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) return res.status(404).json({ message: 'Record not found' });
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching record', error: error.message });
    }
});

/** ------------------------------
 * ✅ 4. UPDATE RECORD BY ID
 * ------------------------------ */
router.put('/:id', async(req, res) => {
    try {
        const updated = await Record.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record updated', record: updated });
    } catch (error) {
        res.status(500).json({ message: 'Error updating record', error: error.message });
    }
});

/** ------------------------------
 * ✅ 5. DELETE RECORD BY ID
 * ------------------------------ */
router.delete('/:id', async(req, res) => {
    try {
        const deleted = await Record.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Record deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting record', error: error.message });
    }
});

/** ------------------------------
 * ✅ 6. UPLOAD CSV FILE
 * ------------------------------ */
router.post('/upload-csv', upload.single('file'), async(req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'CSV file is required' });
    }

    const filePath = req.file.path;
    const records = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Make sure the required fields exist
            if (row.accession_no && row.extension_name && row.subject && row.year) {
                records.push({
                    accession_no: row.accession_no,
                    extension_name: row.extension_name,
                    subject: row.subject,
                    year: parseInt(row.year),
                });
            }
        })
        .on('end', async() => {
            try {
                if (records.length === 0) {
                    return res.status(400).json({ message: 'CSV file is empty or invalid' });
                }

                await Record.insertMany(records);
                fs.unlinkSync(filePath); // remove file after processing
                res.status(200).json({ message: `${records.length} records uploaded successfully` });
            } catch (err) {
                console.error('❌ Error inserting CSV data:', err);
                let msg = 'Failed to insert CSV data.';
                if (err.name === 'ValidationError') {
                    msg += ' Check if all required fields are present and valid.';
                }
                res.status(500).json({ message: msg, error: err.message });
            }
        })
        .on('error', (err) => {
            console.error('❌ CSV read error:', err);
            res.status(500).json({ message: 'Error reading CSV', error: err.message });
        });
});

module.exports = router;