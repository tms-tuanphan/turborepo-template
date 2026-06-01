# File upload (S3/R2)

[← Mục lục](./README.md)

---

## Storage strategy

- Production: upload to cloud object storage (S3, R2) and persist URL (or key) in DB.
- Avoid storing files on API server disk (non-durable, breaks scaling).

---

## Validation

Validate:

- file size (max)
- file type (MIME allowlist)
- filename normalization (avoid path traversal)

---

## Large uploads

For large files:

- use signed URL upload directly from client to storage
- keep API as “signer + metadata recorder”

---

## Virus scanning (optional but recommended)

For untrusted user uploads:

- scan before processing (ClamAV or cloud service)
- quarantine/deny when infected
