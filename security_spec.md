# Security Specification for MedSmart

## 1. Data Invariants
- A User profile must always match the `request.auth.uid`.
- Users cannot change their `role` once set (or only admins can).
- Appointments must be created by the patient (patientId == auth.uid).
- Appointments can be updated by either patient or doctor, but only specific fields.
- Medical Records can only be created by the doctor.
- Medical Records can only be read by the patient and the associated doctor.
- Chat messages can only be sent by participants in the chat.
- All timestamps must be server-validated.
- IDs must follow standard format.

## 2. The "Dirty Dozen" Payloads (Denial Tests)

1. **Identity Spoofing**: Create a user profile with a different UID.
2. **Role Escalation**: Update own role to 'admin'.
3. **Ghost Write (Users)**: Update user profile with an unauthorized field `isVerified: true`.
4. **ID Poisoning**: Create a document with a 2KB junk string as ID.
5. **Orphaned Appointment**: Create an appointment for a non-existent doctor.
6. **Integrity Violation**: Create an appointment with a past timestamp (client-side).
7. **Pillaging (List)**: List all appointments for all users without filtering by patientId.
8. **Malicious Record**: Create a medical record as a patient.
9. **Tampering (Record)**: Update a medical record's diagnosis after creation.
10. **Chat Hijack**: Read messages from a chat the user is not participating in.
11. **Timestamp Spoofing**: Set `createdAt` to a future date.
12. **System Write**: Attempt to write to a system-only field if any.

## 3. The Test Runner
(I will implement `firestore.rules` first then refine tests if needed, but I'll write the rules into `firestore.rules` directly as per common practice in this environment, while strictly following the pillars).
