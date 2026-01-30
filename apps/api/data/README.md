# Dataset: demo_churn.csv

Synthetic churn prediction dataset with 160 rows.

## Columns

| Column | Type | Description |
|--------|------|-------------|
| `age` | int | Customer age in years |
| `tenure_months` | int | Months as a customer (0-54) |
| `monthly_spend` | float | Monthly subscription cost in USD |
| `support_tickets_last_90d` | int | Number of support tickets opened in last 90 days |
| `plan` | categorical | Subscription tier: `basic`, `pro`, `enterprise` |
| `region` | categorical | Geographic region: `latam`, `na` (North America), `eu` (Europe) |
| **`churn`** | **binary** | **Target variable: 1 = churned, 0 = retained** |

## Features Notes

- **Churn pattern**: Newer customers (low tenure) and basic plan users have higher churn rates
- **Balance**: ~45% churn, ~55% retention (slightly imbalanced)
- **Missing values**: None (clean dataset)
- **Categories handled**: OneHotEncoder with `handle_unknown="ignore"` in pipeline

## Usage

Load in Python:
```python
import pandas as pd
df = pd.read_csv("data/demo_churn.csv")
```
