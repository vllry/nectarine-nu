from yoyo import step

step("""
CREATE TABLE settings (
	user VARCHAR(16) NOT NULL,
	temp INT NOT NULL,
	mode INT NOT NULL,
	PRIMARY KEY (user)
)
""")

#Ow, my pride.
step("""
INSERT INTO settings (
	`user`,
	`temp`,
	`mode`
)
VALUES (
	"nebual",
	20,
	2
)
""")
