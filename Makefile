
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

doors.js: components
	@component build --standalone doors --name doors --out .

clean:
	rm -fr build components template.js

.PHONY: clean
