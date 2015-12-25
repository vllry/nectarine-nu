from yoyo import step



#Was debating using triggers to calculate distance, but that would be annoying and only useful if you intend to write another application that writes to the coordinates table.
step("""
ALTER TABLE coordinates
	ADD distance FLOAT
""")
