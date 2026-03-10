import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class DataProcessor:
    """Processes and transforms data records."""

    def __init__(self, config):
        self.config = config
        self.processed_count = 0

    def process_records(self, records):
        """Process a list of records and return transformed results."""
        results = []
        for record in records:
            if not self.validate_record(record):
                logger.warning("Skipping invalid record: %s", record.get("id"))
                continue
            transformed = self.transform(record)
            results.append(transformed)
            self.processed_count += 1
        logger.info("Processed %d records", self.processed_count)
        return results

    def validate_record(self, record):
        """Validate that a record has required fields."""
        required_fields = ["id", "name", "value"]
        return all(field in record for field in required_fields)

    def transform(self, record):
        """Transform a single record."""
        return {
            "id": record["id"],
            "name": record["name"].strip().title(),
            "value": round(record["value"], 2),
            "processed": True,
        }


def main():
    config = {"batch_size": 100, "output_dir": "./output"}
    processor = DataProcessor(config)

    sample_data = [
        {"id": 1, "name": "alice", "value": 3.14159},
        {"id": 2, "name": "bob", "value": 2.71828},
        {"id": 3, "name": "charlie", "value": 1.41421},
    ]

    results = processor.process_records(sample_data)
    for result in results:
        logger.info("Result: %s", result)


if __name__ == "__main__":
    main()
