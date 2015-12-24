from yoyo import step



step("""
CREATE TABLE coordinates (
	time INT NOT NULL,
	lat FLOAT NOT NULL,
	lon FLOAT NOT NULL,
	PRIMARY KEY (time)
)
""")

#"With one exception, the default value must be a constant; it cannot be a function or an expression. This means, for example, that you cannot set the default for a date column to be the value of a function such as NOW() or CURRENT_DATE. The exception is that you can specify CURRENT_TIMESTAMP as the default for a TIMESTAMP column."
step("""
CREATE TRIGGER gps_timestamp
BEFORE INSERT
ON coordinates
	FOR EACH ROW SET new.time = UNIX_TIMESTAMP();
""")
