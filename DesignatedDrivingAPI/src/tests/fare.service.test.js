import { computeFare } from '../services/fare.service.js';

describe('computeFare', () => {
  test('applies minimum fare for very short trips', () => {
    const result = computeFare({ distance_km: 0.5, duration_min: 2 });
    expect(result.total).toBeGreaterThanOrEqual(8);
    expect(result.breakdown.minimum_applied).toBe(true);
  });

  test('calculates fare correctly for a longer trip', () => {
    // base=5, 10km*1.25=12.5, 20min*0.35=7 => subtotal=24.5 > minimum=8
    const result = computeFare({ distance_km: 10, duration_min: 20 });
    expect(result.total).toBe(24.5);
    expect(result.breakdown.minimum_applied).toBe(false);
  });

  test('returns CAD as default currency', () => {
    const result = computeFare({ distance_km: 5, duration_min: 10 });
    expect(result.currency).toBe('CAD');
  });

  test('returns correct breakdown components', () => {
    // base=5, 4km*1.25=5, 10min*0.35=3.5 => subtotal=13.5
    const result = computeFare({ distance_km: 4, duration_min: 10 });
    expect(result.breakdown.base).toBe(5);
    expect(result.breakdown.distance_component).toBe(5);
    expect(result.breakdown.time_component).toBe(3.5);
    expect(result.total).toBe(13.5);
  });

  test('rounds fare total to 2 decimal places', () => {
    const result = computeFare({ distance_km: 1, duration_min: 1 });
    const rounded = Math.round(result.total * 100) / 100;
    expect(result.total).toBe(rounded);
  });

  test('pricing_version is v1', () => {
    const result = computeFare({ distance_km: 5, duration_min: 5 });
    expect(result.pricing_version).toBe('v1');
  });
});
