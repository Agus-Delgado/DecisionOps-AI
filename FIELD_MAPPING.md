# Field Mapping Reference

## Form → Backend Schema

When making predictions, the frontend form fields are mapped to the backend dataset schema:

| Frontend Field | Backend Column | Type | Example |
|---|---|---|---|
| `age` | `age` | int | 35 |
| `tenure_months` | `tenure_months` | int | 24 |
| `monthly_spend` | `monthly_spend` | float | 150.0 |
| **`tickets`** | **`support_tickets_last_90d`** | int | 2 |
| `plan` | `plan` | str (lowercase) | "pro" |
| `region` | `region` | str (lowercase) | "latam" |

## Important Notes

1. **Tickets → support_tickets_last_90d**: The form uses the shorter "Tickets" label for UX, but the backend expects the full column name `support_tickets_last_90d`.

2. **Case normalization**: `plan` and `region` are normalized to lowercase before sending:
   - `Pro` → `pro`
   - `LATAM` → `latam`
   - `Enterprise` → `enterprise`

3. **Request format**: The `/predict` endpoint expects:
   ```json
   {
     "records": [
       {
         "age": 35,
         "tenure_months": 24,
         "monthly_spend": 150.0,
         "support_tickets_last_90d": 2,
         "plan": "pro",
         "region": "latam"
       }
     ]
   }
   ```

## Backend Validation

If the request is missing any required columns, the API returns a 400 error with details:
```
Missing columns: ['support_tickets_last_90d']. Expected: [list of all required columns]
```

This typically means the frontend mapping is incorrect.
