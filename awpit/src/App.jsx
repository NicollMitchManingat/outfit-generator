import { useState, useMemo } from "react";
import "./App.css";
import knitVest from "./assets/Knit Vest over Plain Tee.png";

// --- 0. Custom hook for localStorage persistence ---
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// --- 1. Style Categories ---
const styles = [
  "Any Style",
  "Casual",
  "Streetwear",
  "Minimalist",
  "Y2K",
  "Korean-Inspired",
  "Heritage-Infused",
  "Athleisure",
  "Business Casual",
  "Grunge",
];

// --- 2. Outfit Data with Combined Casual Styles ---
const PLACEHOLDER_IMG = "https://via.placeholder.com/150?text=";

const clothingItems = {
  tops: [
    // --- COMBINED CASUAL (Smart / Clean / Everyday) ---
    {
      name: "Plain Polo Shirt",
      image:
        "https://i.pinimg.com/1200x/18/c7/e9/18c7e98c9d707aa7b25ed8b126bfb601.jpg",
      style: "Casual",
    },
    {
      name: "Fitted T-shirt",
      image:
        "https://i.pinimg.com/736x/35/dc/f6/35dcf64128b87f396209288f0cd32892.jpg",
      style: "Casual",
    },
    {
      name: "Short-Sleeve Button-Down (Solid/Pattern)",
      image:
        "https://i.pinimg.com/1200x/aa/90/cf/aa90cff663d02ecb264b6b4dca235c64.jpg",
      style: "Casual",
    },
    {
      name: "Lightweight Cardigan",
      image:
        "https://i.pinimg.com/1200x/f6/34/e7/f634e72dccc2f2ba9b818ac3f9879746.jpg",
      style: "Casual",
    }, // Formerly Everyday Casual
    {
      name: "Plain T-shirt",
      image:
        "https://i.pinimg.com/736x/20/c8/7f/20c87feef266443a451cb70c687bafc8.jpg",
      style: "Casual",
    },
    {
      name: "Sleeveless Shirt",
      image:
        "https://i.pinimg.com/736x/ab/d9/5c/abd95c37fcc3b99450cedc82474eeada.jpg",
      style: "Casual",
    }, // Grunge

    {
      name: "Oversized Band Tee",
      image:
        "https://i.pinimg.com/1200x/f8/5a/d0/f85ad081605a9adf17a36088a5f5350d.jpg",
      style: "Grunge",
    },
    {
      name: "Flannel Shirt (for Layering)",
      image:
        "https://i.pinimg.com/1200x/10/4a/ec/104aec02b3d6eda157b4bae58b9d087e.jpg",
      style: "Grunge",
    },
    {
      name: "Faded Long-Sleeve Shirt",
      image:
        "https://i.pinimg.com/1200x/61/2d/4a/612d4adb5a0203b3612cccb575981108.jpg",
      style: "Grunge",
    }, // Streetwear

    {
      name: "Oversized Graphic Tee",
      image:
        "https://i.pinimg.com/1200x/d1/f5/2c/d1f52cfd983660aefe0e9f04553bf216.jpg",
      style: "Streetwear",
    },
    {
      name: "Boxy Lightweight Hoodie",
      image:
        "https://i.pinimg.com/736x/07/3f/37/073f37800a4ee60c5cf271149e866239.jpg",
      style: "Streetwear",
    }, // Minimalist

    {
      name: "Plain White Cotton Tee",
      image:
        "https://i.pinimg.com/736x/a1/63/ca/a163ca4fa93791b6428b33631eb35ae9.jpg",
      style: "Minimalist",
    },
    {
      name: "Beige Linen Shirt",
      image:
        "https://i.pinimg.com/1200x/32/7a/2c/327a2c239a1416fdf891d486aba21210.jpg",
      style: "Minimalist",
    }, // Y2K

    {
      name: "Baby Tee / Cropped Top",
      image:
        "https://i.pinimg.com/1200x/14/ed/01/14ed01de2787eb077a46235eb007bb44.jpg",
      style: "Y2K",
    },
    {
      name: "Graphic Tank Top",
      image:
        "https://i.pinimg.com/736x/20/b6/76/20b676d6d33291b990c76c98bf343f5d.jpg",
      style: "Y2K",
    }, // Korean-Inspired

    {
      name: "Oversized Button-down Shirt",
      image:
        "https://i.pinimg.com/1200x/1b/05/37/1b0537c5d0c0d6ea663c397b563fc5ba.jpg",
      style: "Korean-Inspired",
    },
    {
      name: "Knit Vest over Plain Tee",
      image: knitVest,
      style: "Korean-Inspired",
    }, // Heritage-Infused

    {
      name: "Modern Short-Sleeve Barong",
      image: "https://deniseong.com/cdn/shop/files/IMG_2117.png?v=1726998151",
      style: "Heritage-Infused",
    },
    {
      name: "Filipiniana / Terno Blouse",
      image:
        "https://i.pinimg.com/736x/33/05/13/330513670ac218c103c292dad4d1c62f.jpg",
      style: "Heritage-Infused",
    }, // Athleisure

    {
      name: "Dry-Fit Shirt",
      image:
        "https://i.pinimg.com/1200x/1c/cb/0c/1ccb0cb30923eff2b84816d6a60f9ced.jpg",
      style: "Athleisure",
    },
    {
      name: "Sports Bra or Fitted Crop Top",
      image:
        "https://i.pinimg.com/736x/34/91/fa/3491fa5563718f0713594ec59bedf8fc.jpg",
      style: "Athleisure",
    }, // Business Casual

    {
      name: "Striped Button-down",
      image:
        "https://i.pinimg.com/1200x/2d/ce/d3/2dced344fb19d67a5d72a501a28d5ba0.jpg",
      style: "Business Casual",
    },
  ],
  bottoms: [
    // --- CASUAL (Smart / Clean / Everyday) ---
    {
      name: "Slim Jeans",
      image:
        "https://i.pinimg.com/1200x/a7/e3/70/a7e3707ac6f504214fc0cc8cb7aaf24d.jpg",
      style: "Casual",
    },
    {
      name: "Chino Pants",
      image:
        "https://i.pinimg.com/1200x/a9/24/1c/a9241cd927deec3e8797426c03f541e3.jpg",
      style: "Casual",
    },
    {
      name: "Straight Jeans",
      image:
        "https://i.pinimg.com/736x/26/be/cb/26becb64ebf9ec306f04bbe3a70cb04d.jpg",
      style: "Casual",
    },
    {
      name: "Tailored Shorts",
      image:
        "https://i.pinimg.com/1200x/98/c2/e8/98c2e896f5727d9fc1a87838bab3fd38.jpg",
      style: "Casual",
    }, // Formerly Everyday Casual
    {
      name: "Denim Shorts",
      image:
        "https://i.pinimg.com/1200x/cb/ea/ac/cbeaac5d6af791f71cdb978a455bce7e.jpg",
      style: "Casual",
    },
    {
      name: "Jogger Shorts",
      image:
        "https://i.pinimg.com/1200x/ac/2b/60/ac2b603f4220eab382a6af0e8e0a2b2f.jpg",
      style: "Casual",
    }, // Grunge

    {
      name: "Ripped Black Jeans",
      image:
        "https://i.pinimg.com/1200x/b2/6a/ef/b26aef057e882bb8e83b49371c6310f4.jpg",
      style: "Grunge",
    },
    {
      name: "Baggy Denim Jeans",
      image:
        "https://i.pinimg.com/1200x/a6/cb/ab/a6cbabfe3992b8b51e984c02b90d347a.jpg",
      style: "Grunge",
    },
    {
      name: "Cargo Pants (Grunge)",
      image:
        "https://i.pinimg.com/736x/76/9e/09/769e09784fbbaa2d3f63843e0ba3a82f.jpg",
      style: "Grunge",
    }, // Streetwear

    {
      name: "Cargo Pants (Streetwear)",
      image:
        "https://i.pinimg.com/1200x/f7/84/56/f784563e0f7b9c59a014fac4beee46d4.jpg",
      style: "Streetwear",
    },
    {
      name: "Baggy Jeans (Streetwear)",
      image:
        "https://i.pinimg.com/1200x/26/ad/70/26ad70450cf6d93d18fd16ecf021de85.jpg",
      style: "Streetwear",
    }, // Minimalist

    {
      name: "Straight Black Trousers",
      image:
        "https://i.pinimg.com/1200x/2e/7a/f7/2e7af7de848e72f27d5e516030477c64.jpg",
      style: "Minimalist",
    },
    {
      name: "Tailored Shorts",
      image:
        "https://i.pinimg.com/1200x/1d/9e/d5/1d9ed57f7a092f829e0e746b4a3db657.jpg",
      style: "Minimalist",
    }, // Y2K

    {
      name: "Low-Rise Baggy Jeans",
      image:
        "https://i.pinimg.com/736x/73/7f/61/737f61b50990fd0b4b2052437e1c29c7.jpg",
      style: "Y2K",
    },
    {
      name: "Parachute Pants",
      image:
        "https://i.pinimg.com/736x/2e/5a/f8/2e5af8f6449fd430545bc10a4ff1942e.jpg",
      style: "Y2K",
    },
    {
      name: "Mini Skirt",
      image:
        "https://i.pinimg.com/736x/bb/7a/b2/bb7ab2126d63c67056d7e785634fde24.jpg",
      style: "Y2K",
    }, // Korean-Inspired

    {
      name: "Wide-Leg Trousers",
      image:
        "https://i.pinimg.com/1200x/2b/19/7d/2b197d534e1da62cf8517f92cae75249.jpg",
      style: "Korean-Inspired",
    },
    {
      name: "Straight-Cut Jeans",
      image:
        "https://i.pinimg.com/736x/5b/09/4b/5b094b2cbce6e28308e5912b4aa76a4c.jpg",
      style: "Korean-Inspired",
    }, // Heritage-Infused

    {
      name: "Dark Jeans or Slacks",
      image:
        "https://i.pinimg.com/736x/d8/f3/be/d8f3be92e96ed989503f9b6fe30366c1.jpg",
      style: "Heritage-Infused",
    },
    {
      name: "High-Waisted Trousers",
      image:
        "https://i.pinimg.com/1200x/b9/d1/b6/b9d1b699f95b34d74167aba7120f28a4.jpg",
      style: "Heritage-Infused",
    }, // Athleisure

    {
      name: "Joggers (Athleisure)",
      image:
        "https://i.pinimg.com/736x/c2/f0/6c/c2f06c57522453d9c73dd8ef8fb756a8.jpg",
      style: "Athleisure",
    },
    {
      name: "High-Waist Leggings",
      image:
        "https://i.pinimg.com/1200x/ec/23/f0/ec23f075fe3e209a3904acb0df308215.jpg",
      style: "Athleisure",
    }, // Business Casual (Retained existing)

    {
      name: "Khaki Chinos",
      image:
        "https://i.pinimg.com/1200x/a9/24/1c/a9241cd927deec3e8797426c03f541e3.jpg",
      style: "Business Casual",
    },
    {
      name: "Black Slacks",
      image:
        "https://i.pinimg.com/1200x/2a/b1/f4/2ab1f4ebd3f690b3bee542140b8780fd.jpg",
      style: "Business Casual",
    },
  ],
  shoes: [
    // --- CASUAL (Smart / Clean / Everyday) ---
    {
      name: "Clean White Sneakers",
      image:
        "https://i.pinimg.com/1200x/d7/9f/4c/d79f4c7b5cce07aaf25961be664c6ea5.jpg",
      style: "Casual",
    },
    {
      name: "Loafers",
      image:
        "https://i.pinimg.com/736x/b0/f3/d3/b0f3d3fa4661219bdb799c12a26ae577.jpg",
      style: "Casual",
    },
    {
      name: "Slip-on Sneakers",
      image:
        "https://i.pinimg.com/1200x/73/64/2c/73642c80299ca58582fb6d24e841dae3.jpg",
      style: "Casual",
    },
    {
      name: "Slides or Rubber Sandals",
      image:
        "https://i.pinimg.com/1200x/18/0a/49/180a490f428685c3c599d7a1ef8550ea.jpg",
      style: "Casual",
    }, // Grunge

    {
      name: "Combat Boots",
      image:
        "https://i.pinimg.com/736x/1e/ff/1c/1eff1c78016d619014da013dc64580c6.jpg",
      style: "Grunge",
    },
    {
      name: "Worn Sneakers",
      image:
        "https://i.pinimg.com/736x/3c/a7/bf/3ca7bf99ea697b732faa57da8671b091.jpg",
      style: "Grunge",
    },
    {
      name: "Skate Sneakers",
      image:
        "https://i.pinimg.com/1200x/9e/6b/b9/9e6bb9f9a26bebfc0fa3d31bcf877bc4.jpg",
      style: "Grunge",
    },
    {
      name: "Chunky Boots",
      image:
        "https://i.pinimg.com/1200x/36/4d/21/364d21922bd7b85acf49c150c465b9a6.jpg",
      style: "Grunge",
    }, // Streetwear

    {
      name: "Chunky Sneakers",
      image:
        "https://i.pinimg.com/1200x/57/f8/01/57f8018d737105f01c201ebca47477c4.jpg",
      style: "Streetwear",
    },
    {
      name: "Skate Sneakers",
      image:
        "https://i.pinimg.com/736x/44/89/2b/44892bf7169bf20f10c5cd91533747e9.jpg",
      style: "Streetwear",
    }, // Minimalist

    {
      name: "White Minimal Sneakers",
      image:
        "https://i.pinimg.com/1200x/b7/5a/55/b75a551f9636b4848b6558bc00f22e51.jpg",
      style: "Minimalist",
    },
    {
      name: "Leather Loafers",
      image:
        "https://i.pinimg.com/1200x/07/27/f2/0727f252676a5249f6bb9104dae943da.jpg",
      style: "Minimalist",
    }, // Y2K

    {
      name: "Platform Sneakers",
      image:
        "https://i.pinimg.com/1200x/f0/29/81/f029815655421dda4e3c6a073502ca1e.jpg",
      style: "Y2K",
    },
    {
      name: "Chunky Sandals",
      image:
        "https://i.pinimg.com/1200x/54/50/44/545044be5f1392ef70a142a302e125dd.jpg",
      style: "Y2K",
    }, // Korean-Inspired / Heritage-Infused

    {
      name: "Clean White Sneakers",
      image:
        "https://i.pinimg.com/736x/47/16/60/471660e5a433236658d4ecea7271c46a.jpg",
      style: "Korean-Inspired",
    },
    {
      name: "Flats or Block Heels",
      image:
        "https://i.pinimg.com/736x/84/99/a6/8499a6241c1c770dfa66fc93664dfc8c.jpg",
      style: "Heritage-Infused",
    }, // Athleisure

    {
      name: "Training Sneakers",
      image:
        "https://i.pinimg.com/736x/0d/fb/b9/0dfbb9d01350c8ecee876c467a1a4437.jpg",
      style: "Athleisure",
    },
    {
      name: "Running Shoes",
      image:
        "https://i.pinimg.com/736x/e9/90/c8/e990c8c7c6952c47f873311e3449b2b0.jpg",
      style: "Athleisure",
    }, // Business Casual

    {
      name: "Brown Loafers",
      image:
        "https://i.pinimg.com/1200x/51/f3/bc/51f3bcb9dcd22f6919f65509d2b98d92.jpg",
      style: "Business Casual",
    },
  ],
  accessories: [
    // --- CASUAL (Smart / Clean / Everyday) ---
    {
      name: "Watch",
      image:
        "https://i.pinimg.com/1200x/cc/cc/bd/ccccbdcafd81da58d13383fedfe58506.jpg",
      style: "Casual",
    },
    {
      name: "Leather Belt",
      image:
        "https://i.pinimg.com/736x/0a/cf/53/0acf53d9503fa521d9bd3652875dd9e7.jpg",
      style: "Casual",
    },
    {
      name: "Canvas Tote Bag",
      image:
        "https://i.pinimg.com/1200x/3d/bb/d8/3dbbd89e43318f1efe4719a614877eb9.jpg",
      style: "Casual",
    },
    {
      name: "Backpack",
      image:
        "https://i.pinimg.com/1200x/3d/d4/26/3dd4265bf16c0ddea21f495635ebe632.jpg",
      style: "Casual",
    },
    {
      name: "Cap",
      image:
        "https://i.pinimg.com/1200x/53/10/05/53100506a702f979c47904244be1bce5.jpg",
      style: "Casual",
    }, // Grunge

    {
      name: "Chain Necklace ",
      image:
        "https://i.pinimg.com/736x/61/f7/03/61f703d5ac5bf251c4dbace511b27c08.jpg",
      style: "Grunge",
    },
    {
      name: "Beanie",
      image:
        "https://i.pinimg.com/1200x/ff/92/ba/ff92baecfa635349b574fe5b19e94476.jpg",
      style: "Grunge",
    },
    {
      name: "Ring Set",
      image:
        "https://i.pinimg.com/1200x/1e/89/08/1e89081ccfaec6ff057770bb0270c2fb.jpg",
      style: "Grunge",
    }, // Streetwear

    {
      name: "Crossbody Bag",
      image:
        "https://i.pinimg.com/736x/49/ce/57/49ce572d3ca0beb8a512ddc24ff67e13.jpg",
      style: "Streetwear",
    }, // Minimalist

    {
      name: "Minimalist Watch",
      image:
        "https://i.pinimg.com/1200x/16/26/56/162656d92309b132ac3e5d753ab22723.jpg",
      style: "Minimalist",
    }, // Y2K

    {
      name: "Mini Shoulder Bag",
      image:
        "https://i.pinimg.com/1200x/11/1f/0b/111f0b8615927f789a759ecbeaa45cb2.jpg",
      style: "Y2K",
    },
    {
      name: "Small Sunglasses",
      image:
        "https://i.pinimg.com/736x/3d/b6/e0/3db6e088dc24afee97c793b36e7e5e63.jpg",
      style: "Y2K",
    }, // Korean-Inspired

    {
      name: "Canvas Tote Bag",
      image:
        "https://i.pinimg.com/736x/7e/bc/61/7ebc61a4a5ef56955c1daeca2c1984ad.jpg",
      style: "Korean-Inspired",
    },
    {
      name: "Shoulder Bag",
      image:
        "https://i.pinimg.com/1200x/10/0f/63/100f63a66aa0db3a5cd41f5ab35e8a7d.jpg",
      style: "Korean-Inspired",
    }, // Heritage-Infused

    {
      name: "Classic Wristwatch",
      image:
        "https://i.pinimg.com/1200x/05/48/07/05480785069e732109695753a095707a.jpg",
      style: "Heritage-Infused",
    },
    {
      name: "Statement Earrings",
      image:
        "https://i.pinimg.com/736x/42/c6/18/42c6181c881164940d149b95796c29e2.jpg",
      style: "Heritage-Infused",
    }, // Athleisure

    {
      name: "Smartwatch",
      image:
        "https://i.pinimg.com/736x/ef/bb/17/efbb17fc0cfc2be91f2c913c66676a5f.jpg",
      style: "Athleisure",
    },
    {
      name: "Sling Bag",
      image:
        "https://i.pinimg.com/1200x/d0/cd/24/d0cd24631a7afc5070d29178d544728c.jpg",
      style: "Athleisure",
    }, // General

    { name: "No Accessory", image: null, style: "Any Style" },
  ],
};

function App() {
  const initialOutfitItem = { name: "Select", image: null };
  const [outfit, setOutfit] = useState({
    top: initialOutfitItem,
    bottom: initialOutfitItem,
    shoe: initialOutfitItem,
    accessory: initialOutfitItem,
  });
  const [savedOutfits, setSavedOutfits] = useLocalStorage("savedOutfits", []);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(styles[0]); // 'Any Style' as default // Helper to show toast

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const generateOutfit = () => {
    const getRandomItem = (items) =>
      items[Math.floor(Math.random() * items.length)]; // Function to filter items by selected style

    const getFilteredItems = (category) => {
      if (selectedStyle === "Any Style") {
        return clothingItems[category];
      } // Filter items that match the selected style OR are marked as 'Any Style'
      let targetStyles = [selectedStyle];

      return clothingItems[category].filter(
        (item) => item.style === selectedStyle || item.style === "Any Style"
      );
    }; // Get filtered items for each category

    const filteredTops = getFilteredItems("tops");
    const filteredBottoms = getFilteredItems("bottoms");
    const filteredShoes = getFilteredItems("shoes");
    const filteredAccessories = getFilteredItems("accessories"); // Check if categories are empty

    if (
      filteredTops.length === 0 ||
      filteredBottoms.length === 0 ||
      filteredShoes.length === 0
    ) {
      showToast(
        `Not enough items for the '${selectedStyle}' style. Try 'Any Style'!`
      ); // Optionally reset the outfit or keep the current one
      return;
    }

    setOutfit({
      top: getRandomItem(filteredTops),
      bottom: getRandomItem(filteredBottoms),
      shoe: getRandomItem(filteredShoes),
      accessory: getRandomItem(filteredAccessories),
    });
  };

  const saveOutfit = () => {
    if (outfit.top.name === "Select") {
      showToast("Generate an outfit first!");
      return;
    }
    const newSaved = [outfit, ...savedOutfits.slice(0, 9)]; // Limit to 10
    setSavedOutfits(newSaved);
    showToast("Outfit saved!");
  };

  const deleteOutfit = (index) => {
    const updated = savedOutfits.filter((_, i) => i !== index);
    setSavedOutfits(updated);
    showToast("Outfit deleted!");
  };

  const regenerateOutfit = (savedOutfit) => {
    setOutfit(savedOutfit);
    setShowHistory(false);
    showToast("Outfit regenerated!");
  }; // Memoize outfit items for performance

  const outfitItems = useMemo(
    () => [
      { label: "Top", item: outfit.top },
      { label: "Bottom", item: outfit.bottom },
      { label: "Shoes", item: outfit.shoe },
      { label: "Accessory", item: outfit.accessory },
    ],
    [outfit]
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 transition-colors">
            {" "}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-indigo-700 dark:text-indigo-300 tracking-wider">
              Outfit Generator   {" "}
      </h1>
          {/* Toast Notification */}    {" "}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-xl z-50 transition-opacity duration-500 animate-fadeInOut">
                 {toast}   {" "}
        </div>
      )}
          {/* Main Card Container */}    {" "}
      <div className="bg-white dark:bg-gray-800 p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-4xl mb-6 border-t-4 border-indigo-500">
             {/* Style Selector & Current Look Header */}   {" "}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
              {" "}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 sm:mb-0">
                     Current Look:     {" "}
          </h2>
                  {/* Style Selector */}    {" "}
          <div className="flex items-center space-x-3">
                          {" "}
            <label
              htmlFor="style-select"
              className="text-md font-medium text-gray-600 dark:text-gray-300"
            >
                         Style:      {" "}
            </label>
                          {" "}
            <select
              id="style-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-base focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            >
                              {" "}
              {styles.map((style) => (
                <option key={style} value={style}>
                                {style}       {" "}
                </option>
              ))}
                            {" "}
            </select>
                         {" "}
          </div>
             {" "}
        </div>
              {/* Grid Layout for Outfit Items */}     {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {" "}
          {outfitItems.map(({ label, item }) => (
            <OutfitItem key={label} label={label} item={item} />
          ))}
                   {" "}
        </div>
              {/* Buttons */}     {" "}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                    {" "}
          <button
            onClick={generateOutfit}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-lg rounded-full shadow-lg hover:shadow-indigo-400 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Generate a new random outfit"
          >
                     Generate {selectedStyle} Look     {" "}
          </button>
                    {" "}
          <button
            onClick={saveOutfit}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-full shadow-md hover:shadow-green-400 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            aria-label="Save the current outfit"
          >
                     Save Outfit     {" "}
          </button>
                   {" "}
        </div>
                {" "}
      </div>
         {/* History Button Toggle */}  {" "}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="px-6 py-2 mb-6 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-full shadow-inner hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200"
        aria-label="Toggle saved outfits history"
      >
            {showHistory ? "Hide Saved History" : "View Saved Outfits"}  {" "}
      </button>
          {/* Saved Outfits History */}    {" "}
      {showHistory && (
        <SavedOutfits
          savedOutfits={savedOutfits}
          onDelete={deleteOutfit}
          onRegenerate={regenerateOutfit}
        />
      )}
           {" "}
      <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
              *Your saved looks are stored locally in your browser.   {" "}
      </p>
          {" "}
    </div>
  );
}

// --- 3. Sub-component for Displaying an Item (OutfitItem) ---
const OutfitItem = ({ label, item }) => {
  const isInitial = item.name === "Select";
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition duration-150 animate-fade-in">
            {" "}
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-gray-600">
                {" "}
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/80?text=Error";
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-base font-light text-gray-400">
                  <span className="text-3xl mb-1">❓</span>     {" "}
            {isInitial ? "Generate a Look" : "N/A"}    {" "}
          </div>
        )}
              {" "}
      </div>
           {" "}
      <div>
                {" "}
        <h3 className="text-sm font-semibold uppercase text-indigo-500 dark:text-indigo-400">
                 {label}   {" "}
        </h3>
                {" "}
        <p
          className={`text-xl font-extrabold ${
            isInitial
              ? "text-gray-400 italic"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
                 {item.name}   {" "}
        </p>
              {" "}
      </div>
          {" "}
    </div>
  );
};

// --- 4. Sub-component for Saved Outfits (SavedOutfits) ---
const SavedOutfits = ({ savedOutfits, onDelete, onRegenerate }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl w-full max-w-4xl mt-3 animate-slideIn">
       {" "}
    <h2 className="text-xl font-bold mb-4 text-left text-gray-800 dark:text-gray-200 border-b pb-2 border-gray-200 dark:border-gray-700">
          History ({savedOutfits.length} saved)     {" "}
    </h2>
       {" "}
    {savedOutfits.length === 0 ? (
      <p className="text-center text-gray-500 dark:text-gray-400">
              No saved outfits yet!      {" "}
      </p>
    ) : (
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {" "}
        {savedOutfits.map((savedOutfit, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600"
          >
                     {/* Item Images and Names Container */}     
              {" "}
            <div className="flex flex-col w-full md:w-3/4 mb-3 md:mb-0">
                        {/* Row 1: Images */}          {" "}
              <div className="flex justify-center md:justify-start space-x-2 mb-1">
                                   {" "}
                {Object.values(savedOutfit).map((item, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0"
                  >
                                            {" "}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs text-gray-500">
                                          N/A        
                          {" "}
                      </div>
                    )}
                                          {" "}
                  </div>
                ))}
                                 {" "}
              </div>
                     {/* Row 2: Names (Summary) */}      {" "}
              <div className="text-xs text-gray-700 dark:text-gray-300 text-center md:text-left">
                       {" "}
                <span className="font-semibold text-indigo-500 dark:text-indigo-400">
                           Summary:        {" "}
                </span>
                        {/* Combine Top and Bottom names */}     
                  {savedOutfit.top.name} + {savedOutfit.bottom.name}    
                 {" "}
              </div>
                            {" "}
            </div>
                     {/* Action Buttons */}        {" "}
            <div className="flex space-x-2 flex-shrink-0">
                             {" "}
              <button
                onClick={() => onRegenerate(savedOutfit)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition shadow-sm"
                title="Wear this outfit"
              >
                            Wear       {" "}
              </button>
                             {" "}
              <button
                onClick={() => onDelete(index)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition shadow-sm"
                title="Delete this saved outfit"
              >
                            Delete       {" "}
              </button>
                            {" "}
            </div>
                         {" "}
          </div>
        ))}
               {" "}
      </div>
    )}
      {" "}
  </div>
);

export default App;
