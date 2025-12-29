-- Seed sample models and specs for WrenchMC

insert into specs (component_name, bolt_size, torque_spec_low, torque_spec_high, sequence_notes, applicable_years, applicable_models, approved, source_notes)
values
('Transmission cover', 'M8', 20, 25, null, array['2018'], array['Softail'], true, 'Community seed data'),
('Primary chain adjuster bolt', 'M10', 35, 40, null, array['2018','2019'], array['Sportster'], true, 'Service manual excerpt (example)'),
('Exhaust flange nut', '3/8-16', 15, 18, null, array['2005','2006','2007'], array['Dyna'], true, 'Sample')
;
