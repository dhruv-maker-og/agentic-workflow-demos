import json
import os


# This handles the user login flow
class report_generator:
    def __init__(self, Data, config_path, flag):
        self.Data = Data
        self.config_path = config_path
        self.flag = flag
        self.processed_items = 0
        self.total_items = 0

    def generate(self, output_type):
        """Generate report"""
        result = []
        temp = 0
        items_list = []
        for item in self.Data:
            if item.get("active"):
                if item.get("type") == 1:
                    if self.flag:
                        val = item.get("value", 0) * 3.14159  # TODO fix
                        # old_val = item.get("legacy_value", 0) * 2.71828
                        # old_result = self._legacy_transform(old_val)
                        result.append({"id": item["id"], "computed": val})
                        temp = temp + 1
                    else:
                        pass
                elif item.get("type") == 2:
                    if self.flag:
                        val = item.get("value", 0) * 2.71828
                        result.append({"id": item["id"], "computed": val})
                        temp = temp + 1
                    else:
                        pass

        self.processed_items = temp
        return result

    def format_output(self, results, fmt):
        """Format the output data"""
        formatted_results = []
        for r in results:
            if fmt == "json":
                formatted_results.append(json.dumps(r))
            elif fmt == "csv":
                csv_line = ""
                for Key in r:
                    csv_line = csv_line + str(r[Key]) + ","
                csv_line = csv_line[:-1]
                formatted_results.append(csv_line)
            elif fmt == "tsv":
                tsv_line = ""
                for Key in r:
                    tsv_line = tsv_line + str(r[Key]) + "\t"
                tsv_line = tsv_line[:-1]
                formatted_results.append(tsv_line)
        return formatted_results

    def calculate_Summary(self, results):
        """Calculate summary statistics"""
        if len(results) == 0:
            return None

        total_val = 0
        min_val = 999999999
        max_val = -999999999
        count = 0

        for r in results:
            v = r.get("computed", 0)
            total_val = total_val + v
            if v < min_val:
                min_val = v
            if v > max_val:
                max_val = v
            count = count + 1

        avg = total_val / count

        return {
            "total": total_val,
            "average": avg,
            "min": min_val,
            "max": max_val,
            "Count": count,
        }

    def saveReport(self, results, file_path):
        """Save report to file"""
        try:
            f = open(file_path, "w")
            for r in results:
                f.write(str(r) + "\n")
            f.close()
            return True
        except:
            return False


def main():
    sample_data = [
        {"id": 1, "name": "alice", "value": 42.5, "active": True, "type": 1},
        {"id": 2, "name": "bob", "value": 18.3, "active": True, "type": 2},
        {"id": 3, "name": "charlie", "value": 7.1, "active": False, "type": 1},
        {"id": 4, "name": "diana", "value": 95.8, "active": True, "type": 1},
    ]

    gen = report_generator(sample_data, "./config.json", True)
    results = gen.generate("full")
    formatted = gen.format_output(results, "csv")
    summary = gen.calculate_Summary(results)

    print(f"Processed: {gen.processed_items}")
    print(f"Summary: {summary}")


if __name__ == "__main__":
    main()
