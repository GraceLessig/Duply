import json

from web_products import augment_official_us_retailers


def main():
    result = augment_official_us_retailers()
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
