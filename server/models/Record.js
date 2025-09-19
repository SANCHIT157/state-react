const mongoose = require("mongoose");
const { Schema } = mongoose;

const recordSchema = new Schema({
    sub_category_id: {
        type: Schema.Types.ObjectId,
        ref: "RecordSubCategory",
        require: true,
    },
    sub_category_title: {
        type: String,
    },
    category_id: {
        type: Schema.Types.ObjectId,
        ref: "RecordCategory",
    },
    category_name: {
        type: String,
    },
    starting_no: {
        type: Number,
    },
    accession_no: {
        type: String,
        required: true,
    },
    extension_name: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
    },
    accessionIdentifier: {
        type: String,
    },
    acquired_type: {
        type: String,
    },
    acquired_from: {
        type: String,
    },
    date_of_acquired: {
        type: String,
    },
    subject: {
        type: String,
    },
    regional_subject: {
        type: String,
    },
    bundle_no: {
        type: String,
    },
    file_no: {
        type: String,
    },
    proceeding_no: {
        type: String,
    },
    record_type: {
        type: String,
    },
    language: {
        type: String,
    },
    condition: {
        type: String,
    },
    department: {
        type: String,
    },
    branch: {
        type: String,
    },
    period_from: {
        type: String,
        validate: {
            validator: (value) => typeof value === "string",
            message: "period_from must be a string",
        },
    },
    period_to: {
        type: String,
    },
    issue_receipt: {
        type: String,
    },
    issue: {
        type: String,
    },
    bProgress: {
        type: String,
    },
    year: {
        type: Number,
    },
    no_of_pages: {
        type: Number,
    },
    binding: {
        type: String,
    },
    size: {
        type: String,
    },
    accompany_materials: {
        type: String,
    },
    no_of_copies: {
        type: Number,
    },
    house_of_record: {
        type: String,
    },
    repaired: {
        type: String,
    },
    repaired_date: {
        type: String,
    },
    microfilm: {
        type: String,
    },
    microfilm_date: {
        type: String,
    },
    microfilm_roll_no: {
        type: String,
    },

    digitized_images: {
        type: String,
    },
    no_of_images: {
        type: Number,
    },
    microfilm_type: {
        type: String,
    },
    digitized: {
        type: String,
    },
    digitized_date: {
        type: String,
    },
    rack_no: {
        type: String,
    },
    shelf_no: {
        type: String,
    },
    remarks: {
        type: String,
    },
    thumbnail: {
        type: String,
    },
    OCR_FILE: {
        type: String,
    },
    QC_FILE: {
        type: String,
    },
    RAW_FILE: {
        type: String,
    },
    REF_FILE: {
        type: String,
    },
    OCR_FILE_PAGES: {
        type: String,
    },
    QC_FILE_PAGES: {
        type: String,
    },
    RAW_FILE_PAGES: {
        type: String,
    },
    REF_FILE_PAGES: {
        type: String,
    },


    OCR_FILE_SIZE: {
        type: String,
    },
    QC_FILE_SIZE: {
        type: String,
    },
    RAW_FILE_SIZE: {
        type: String,
    },
    REF_FILE_SIZE: {
        type: String,
    },

    OCR_FILE_CHECKSUM: {
        type: String,
    },
    QC_FILE_CHECKSUM: {
        type: String,
    },
    RAW_FILE_CHECKSUM: {
        type: String,
    },
    REF_FILE_CHECKSUM: {
        type: String,
    },


    FILE_TEXT: {
        type: String,
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});


const Record = mongoose.model("Record", recordSchema);
module.exports = Record;