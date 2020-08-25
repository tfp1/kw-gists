0. De-indent everything to the baseline
1. Convert `ObjectId()` to string with regex
	- ```(ObjectId\()("[A-f0-9]{24}")(\))(,)? --> $2$4```
2. Replace `\r\n\r\n` --> ` `
3. Replace `\n\n` --> ` `
4. Replace `\r\n` --> ` `
5. Replace `|` --> `-`
6. Fix the single instance of `ú` to `£`. ObjectId = 52e9c3ec549d52b288016ed6
7. Replace `\"` with ``
8. Replace `\n\n` with ` `
9. Replace `\n` with ` `
10. Replace `\t` with ` `
11. Replace ` ` with ` `
12. Replace dates
     - ```(ISODate\()(\"[\d]{4}-[\d]{1,2}-[\d]{1,2}T[\d]{1,2}:[\d]{1,2}:[\d]{1,2}.[\d]{3}Z")(\)) --> $2```
