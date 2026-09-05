import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "core.settings"
)

import django

django.setup()

from store.models import Product

import requests
from dotenv import load_dotenv

load_dotenv()


# --------------------------------------------------
# SETTINGS
# --------------------------------------------------

API_URL = "https://scrappa.co/api/images"

START_ID = 11


# --------------------------------------------------
# API KEY
# --------------------------------------------------

api_key = os.getenv("SCRAPPA_API_KEY")

if not api_key:
    print("ERROR: SCRAPPA_API_KEY not found in .env")
    exit()

headers = {
    "X-API-KEY": api_key
}


# --------------------------------------------------
# OFFICIAL BRAND WEBSITES
# --------------------------------------------------

official_domains = {
    "ASUS": "asus.com",
    "Lenovo": "lenovo.com",
    "HP": "hp.com",
    "Acer": "acer.com",
    "Dell": "dell.com",
    "Samsung": "samsung.com",
    "OnePlus": "oneplus.com",
    "Google": "store.google.com",
    "Nothing": "nothing.tech",
    "Xiaomi": "mi.com",
    "Motorola": "motorola.com",
    "Realme": "realme.com",
    "iQOO": "iqoo.com",
    "Logitech": "logitech.com",
    "Anker": "anker.com",
    "Portronics": "portronics.com",
    "TP-Link": "tp-link.com",
    "Sony": "sony.com",
    "JBL": "jbl.com",
    "boAt": "boat-lifestyle.com",
    "Philips": "philips.com",
    "LG": "lg.com",
    "Bajaj": "bajajelectricals.com",
    "Amazfit": "amazfit.com",
    "Noise": "gonoise.com",
    "Razer": "razer.com",
    "Redragon": "redragonshop.com",
    "HyperX": "hyperx.com",
    "Xbox": "xbox.com",
    "Cosmic Byte": "cosmicbyte.com",
}


# --------------------------------------------------
# FIND OFFICIAL DOMAIN
# --------------------------------------------------

def get_official_domain(product_name):

    for brand, domain in official_domains.items():

        if product_name.lower().startswith(
            brand.lower()
        ):
            return domain

    return None


# --------------------------------------------------
# PRODUCTS
# --------------------------------------------------

products = Product.objects.filter(
    id__gte=START_ID
).order_by("id")

print(
    f"Products to process: {products.count()}"
)


# --------------------------------------------------
# PROCESS PRODUCTS
# --------------------------------------------------

for product in products:

    PRODUCT_NAME = product.name
    OUTPUT_NAME = f"{product.slug}.jpg"

    print("\n" + "#" * 60)
    print("Product:", PRODUCT_NAME)
    print("ID:", product.id)
    print("Filename:", OUTPUT_NAME)
    print("#" * 60)


    # --------------------------------------------------
    # SOURCE PRIORITY
    # --------------------------------------------------

    sources = []

    official_domain = get_official_domain(
        PRODUCT_NAME
    )

    if official_domain:

        sources.append(
            (
                "Official",
                f"site:{official_domain}"
            )
        )

    sources.extend([
        ("Amazon", "site:amazon.in"),
        ("Flipkart", "site:flipkart.com"),
    ])


    selected_image = None
    selected_source = None


    # --------------------------------------------------
    # SEARCH SOURCES
    # --------------------------------------------------

    for source_name, site in sources:

        query = f"{site} {PRODUCT_NAME}"

        print("\n" + "=" * 60)
        print("Searching:", source_name)
        print("Query:", query)
        print("=" * 60)


        params = {
            "q": query,
            "imgcolor": "white",
            "imgsz": "large",
            "imgtype": "photo",
        }


        try:

            response = requests.get(
                API_URL,
                headers=headers,
                params=params,
                timeout=30,
            )

        except requests.RequestException as error:

            print("Search failed:", error)
            continue


        print(
            "Status:",
            response.status_code
        )


        if response.status_code != 200:

            print("API error:")
            print(response.text)

            continue


        data = response.json()


        if not data:

            print("No images found.")
            continue


        # --------------------------------------------------
        # FIRST RESULT
        # --------------------------------------------------

        image = data[0]

        print("\nResult found:")
        print(
            "Title:",
            image.get("title")
        )
        print(
            "Source:",
            image.get("source")
        )
        print(
            "Original:",
            image.get("original")
        )
        print(
            "Dimensions:",
            image.get("original_width"),
            "x",
            image.get("original_height")
        )


        image_url = image.get("original")


        if not image_url:

            print("No original image URL.")
            continue


        # --------------------------------------------------
        # DOWNLOAD IMAGE
        # --------------------------------------------------

        try:

            image_response = requests.get(
                image_url,
                headers={
                    "User-Agent": "Mozilla/5.0"
                },
                timeout=30,
            )

        except requests.RequestException as error:

            print(
                "Image download failed:",
                error
            )

            continue


        print(
            "Download status:",
            image_response.status_code
        )


        if image_response.status_code != 200:

            print(
                "Could not download image."
            )

            continue


        # --------------------------------------------------
        # VERIFY IMAGE
        # --------------------------------------------------

        content_type = image_response.headers.get(
            "Content-Type",
            ""
        )

        print(
            "Content type:",
            content_type
        )


        if not content_type.startswith("image/"):

            print(
                "Downloaded file is not an image."
            )

            continue


        # --------------------------------------------------
        # SAVE IMAGE
        # --------------------------------------------------

        os.makedirs(
            "media/images",
            exist_ok=True
        )


        image_path = os.path.join(
            "media/images",
            OUTPUT_NAME
        )


        with open(
            image_path,
            "wb"
        ) as image_file:

            image_file.write(
                image_response.content
            )


        print(
            "Image saved:",
            image_path
        )


        # --------------------------------------------------
        # REPLACE PRODUCT IMAGE
        # --------------------------------------------------

        product.image = f"images/{OUTPUT_NAME}"

        product.save(
            update_fields=["image"]
        )


        # --------------------------------------------------
        # VERIFY DATABASE
        # --------------------------------------------------

        product.refresh_from_db()

        print(
            "Product.image updated:",
            product.image.name
        )


        selected_image = image
        selected_source = source_name

        break


    # --------------------------------------------------
    # FINAL RESULT
    # --------------------------------------------------

    if not selected_image:

        print(
            "\nNO IMAGE FOUND FOR:",
            PRODUCT_NAME
        )

    else:

        print("\n" + "=" * 60)
        print("IMAGE COMPLETE")
        print("=" * 60)
        print("Product:", PRODUCT_NAME)
        print("Source:", selected_source)
        print("File:", OUTPUT_NAME)
        print(
            "Database:",
            product.image.name
        )