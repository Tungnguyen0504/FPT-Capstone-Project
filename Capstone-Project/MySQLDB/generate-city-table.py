import json

f = open("provinces.json", encoding="utf8")
sqlFile = open("provinces.sql", "w", encoding="utf8")

data = json.load(f)

cities = []

sqlFile.write("""
    SET SQL_SAFE_UPDATES = 0;
    delete from city;
    insert into city (cityId, cityName) values 
""")

for i, city in enumerate(data):
    sqlFile.write("({}, '{}')".format(city["code"], city["name"]) + (";" if i == len(data) - 1 else ","))

# districts
sqlFile.write("""
    delete from district;
    insert into district (districtId, districtName, cityId) values 
""")

districtSql = []
for city in data:
    for district in city["districts"]:
        districtSql.append("({}, \"{}\", {})".format(district["code"], district["name"], city["code"]))

sqlFile.write(", ".join(districtSql) + ";")

# wards

# districts
sqlFile.write("""
    delete from ward;
    insert into ward (wardId, wardName, districtId) values 
""")

wardSql = []
for city in data:
    for district in city["districts"]:
        for ward in district["wards"]:
            wardSql.append("({}, \"{}\", {})".format(ward["code"], ward["name"], district["code"]))

sqlFile.write(", ".join(wardSql) + ";")

sqlFile.write("""
    SET SQL_SAFE_UPDATES = 1;
""")

f.close()
sqlFile.close()