# 🎨 Zapi Card Design System - Fix Plan

## Current Website Design System:

### Colors:
```css
Primary Gradient: Blue → Purple → Pink
  from-blue-500 via-purple-500 to-pink-500

Buttons:
  .btn-primary: Blue-Purple-Pink gradient with white text
  .gradient-primary: Same gradient
```

### Typography (Need to standardize):
```
Section Titles: Should all be same size
Target: text-4xl md:text-5xl
```

### Spacing (Need to increase):
```
Current: py-20 (5rem)
Target: py-24 or py-28 (more space)
```

---

## 🔧 Fixes Needed:

### 1. Section Title Consistency:
All section titles should be:
```jsx
className="text-4xl md:text-5xl font-bold"
```

### 2. Section Spacing:
All sections should have:
```jsx
className="py-24 px-4 sm:px-6 lg:px-8" // or py-28
```

### 3. Button Colors:
All CTA buttons should use:
```jsx
className="btn-primary" 
// OR
className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white"
```

---

## 📋 Components to Fix:

1. ✅ HeroSection - Already using website colors
2. StatsSection - Check title size
3. HealthCardShowcase - Check title & button
4. HowItWorksSection - Check title
5. FeaturesSection - Check title
6. PricingSection - Check title & buttons
7. BenefitsSection - Check title
8. VideoDemoSection - Check title
9. TrustedBySection - Simple, may not need title
10. TestimonialsSection - Check title
11. ComparisonSection - Check title & button
12. FinalCTASection - Check buttons
13. FAQSection - Check title

---

Fixing now...

