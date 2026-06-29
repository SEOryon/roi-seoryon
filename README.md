# roi.seoryon.com — SEO ROI / Value Calculator

A free, 100% static, client-side calculator that shows a business owner what SEO is
actually worth to them: the visitors needed to hit a revenue goal, what that traffic is
worth, and an honest agency-vs-SEOryon cost comparison with payback.

A SEOryon hero / lead-magnet tool — sibling of [score.seoryon.com](https://score.seoryon.com)
and [inspect.seoryon.com](https://inspect.seoryon.com). Same brand system, same EN/DE/FR
i18n pattern.

## Why it's safe

- **100% static / client-side.** All math runs in the browser. No backend, no API, no keys,
  no database, no network request for the calculation, no user data stored or transmitted.
- The only persisted state is the chosen language (`localStorage`), exactly like score/inspect.

## Honesty

- The SEO-agency cost range (**€1,000–€5,000/month**) is cited to
  [Ahrefs' survey of 439 companies](https://ahrefs.com/blog/seo-pricing/) (SEO averages
  ~$2,917/mo; agencies ~$3,209/mo). The citation is visible in the result card.
- All outputs are labelled estimates, rounded sensibly (no fake precision).
- Conversion-rate / customer-value defaults are clearly-labelled starting assumptions the
  user edits — never presented as the user's real numbers.
- SEOryon is anchored at **"from €39/month"** (the Starter floor) so the comparison can't
  go stale. Savings are computed conservatively against the low end of the agency range.

## Structure

```
web/
  index.html   # single H1, hero, calculator (input + result), comparison, FAQ, CTA
  style.css    # SEOryon brand tokens (reused from score) + calculator styles
  app.js       # EN/DE/FR i18n dictionary + pure client-side calculator
  *.png/.svg    # shared SEOryon brand assets
vercel.json    # static deploy config
```

## Deploy

Static site on Vercel. Production domain: **roi.seoryon.com**
(CNAME `roi` → `cname.vercel-dns.com`, DNS-only).

```
vercel --prod
```
