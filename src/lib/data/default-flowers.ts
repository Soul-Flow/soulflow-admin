import type { Flower } from "@/types/soulflow";

export const defaultFlowers: Flower[] = [
	{
		id: "parisian-rose",
		name: "The Parisian Rose Bouquet",
		scientificName: "Rosa damascena 'Parisian'",
		priceSmall: 75,
		priceMedium: 120,
		priceLarge: 180,
		description:
			"An elegant vintage-inspired arrangement of velvet French garden roses, creamy white hydrangea, and wild local eucalyptus. This hand-tied bouquet whispers romantic timelines and is perfect for declarations of love or sophisticated home accents.",
		category: "Roses",
		symbolism:
			"Ultimate devotion, poetic love, and refined artistic appreciation.",
		careGuide:
			"Keep stalks in cool fresh water. Cut stems diagonally under running water every 2 days. Keep away from direct sunlight & ripe fruits.",
		image:
			"https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "dried-lavender",
		name: "Provence Lavender Harvest",
		scientificName: "Lavandula angustifolia 'Provence'",
		priceSmall: 45,
		priceMedium: 65,
		priceLarge: 95,
		description:
			"Sourced from the sun-drenched terraced hillsides of southern France. This elegant bundle of lavender stems is naturally dried to preserve both its ethereal lilac indigo coloring and its deeply calming aromatherapy essential oils.",
		category: "Dried Botanicals",
		symbolism: "Serenity, deep healing, wisdom, and atmospheric protection.",
		careGuide:
			"Requires no watering. Keep away from highly humid spaces or direct spray to guard the signature aroma.",
		image:
			"https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "blush-peonies",
		name: "Blush Peony Atelier",
		scientificName: "Paeonia lactiflora 'Sarah Bernhardt'",
		priceSmall: 90,
		priceMedium: 150,
		priceLarge: 210,
		description:
			"A spectacular, cloud-like mound of lush pillow-soft pink blush peonies and white spray roses, accented with sprigs of deep green mountain laurel. Highly seasonal, this represents the very pinnacle of luxury floristry.",
		category: "Peonies",
		symbolism: "Abundant prosperity, good fortune, happy marriage, and honor.",
		careGuide:
			"Very thirsty blooms. Fill vase to 3/4 depth with clean warm water. Snip 1cm off stems daily for maximum expansion.",
		image:
			"https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "emerald-lily",
		name: "Emerald Casa Lily Bouquet",
		scientificName: "Lilium auratum 'Emerald'",
		priceSmall: 60,
		priceMedium: 95,
		priceLarge: 140,
		description:
			"Elegant architectural white Oriental lilies coupled with majestic silver dollars, baby blue globes, and shiny emerald monstera leaves. Excellent for broad, airy minimalist spaces and high-contrast styling.",
		category: "Exotics",
		symbolism: "Spiritual purity, majestic grace, and grand transformation.",
		careGuide:
			"Remove orange pollen-tipped stamens as they open to avoid fabric staining. Change vase water entirely every 3 days.",
		image:
			"https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "sunset-dahlias",
		name: "Tuscan Sunset Dahlias",
		scientificName: "Dahlia pinnata 'Sunset'",
		priceSmall: 55,
		priceMedium: 85,
		priceLarge: 125,
		description:
			"Brimming with vibrant shades of coral orange, bronze velvet, and gold-trimmed peach dahlias. A celebratory arrangement that mimics the warm, romantic hues of an early autumn Tuscan dusk.",
		category: "Exotics",
		symbolism:
			"Inward resilience, unique creative power, and eternal gratitude.",
		careGuide:
			"Prefers mild room temperature water. Keep water neat by discarding any foliage submerged beneath the waterline.",
		image:
			"https://images.unsplash.com/photo-1565280743844-2fa064644e47?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fGFib3V0JTIwdXMlMjBmbG93ZXJ8ZW58MHwxfDB8fHwy",
		popular: true,
	},
	{
		id: "cottage-wildflower",
		name: "Cottage Garden Meadow",
		scientificName: "Anemone coronaria 'Meadow'",
		priceSmall: 50,
		priceMedium: 80,
		priceLarge: 110,
		description:
			"An informal, countryside-inspired arrangement composed of elegant poppy anemones, sky blue delphiniums, sweet chamomile flowers, and delicate sprigs of Queen Anne's lace.",
		category: "Dried Botanicals",
		symbolism: "Ethereal anticipation, natural simplicity, and joy.",
		careGuide:
			"Snip bottom of the delicate stems under clean cool water every 2 days. Stand in a tall bottle neck vase.",
		image:
			"https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&q=80&w=600",
		popular: false,
	},
	{
		id: "crimson-velvet",
		name: "Crimson Velvet Emperor",
		scientificName: "Rosa hybrid 'Crimson Velvet'",
		priceSmall: 80,
		priceMedium: 130,
		priceLarge: 195,
		description:
			"An elegant deeply dark red selection of velvet Ecuadorian roses accented by chocolate cosmos and black gold eucalyptus leaves.",
		category: "Roses",
		symbolism: "Deep-seated passion, courage, and timeless nobility.",
		careGuide:
			"Recut stems under lukewarm water and place in an opaque vase with ample water support.",
		image:
			"https://images.unsplash.com/photo-1560975684-9a7b778c2dd6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fGFib3V0JTIwdXMlMjBmbG93ZXJ8ZW58MHwxfDB8fHwy",
		popular: true,
	},
	{
		id: "peach-juliet",
		name: "Peach Juliet Luxury Bouquet",
		scientificName: "Rosa 'Juliet'",
		priceSmall: 85,
		priceMedium: 140,
		priceLarge: 200,
		description:
			"The legendary peach Juliet David Austin rose paired with white ranunculus, pastel sweet peas, and fresh olive branches.",
		category: "Roses",
		symbolism: "Graceful charm, warm connections, and elegant warmth.",
		careGuide:
			"Keep in fresh cool water. Cut diagonally every 24 hours. Keep out of breezy spots.",
		image:
			"https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "empress-coral",
		name: "Empress Coral Peony Selection",
		scientificName: "Paeonia hybrid 'Coral Sunset'",
		priceSmall: 95,
		priceMedium: 160,
		priceLarge: 220,
		description:
			"Spectacular rare coral-orange peonies that magically fade into amber-cream as they expand. Complemented with wild rosemary.",
		category: "Peonies",
		symbolism: "Eternal wealth, glowing transitions, and grand prosperity.",
		careGuide:
			"Very heavy blooms; support with a sturdy ceramic vessel filled 2/3 of water.",
		image:
			"https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "white-majesty",
		name: "White Majesty Peony Atelier",
		scientificName: "Paeonia lactiflora 'Duchesse de Nemours'",
		priceSmall: 110,
		priceMedium: 170,
		priceLarge: 240,
		description:
			"Pure majestic white peonies crowned by double-scented jasmine vine and delicate lemon-scented eucalyptus.",
		category: "Peonies",
		symbolism:
			"Absolute purity of intent, spiritual honor, and discrete luxury.",
		careGuide:
			"Add clean ice cubes daily to maintain low temperature water for longer bloom integrity.",
		image:
			"https://images.unsplash.com/photo-1626159176951-17da083771d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjJ8fGFib3V0JTIwdXMlMjBmbG93ZXJ8ZW58MHwxfDB8fHwy",
		popular: true,
	},
	{
		id: "golden-pampas",
		name: "Amalfi Coast Dried Pampas",
		scientificName: "Cortaderia selloana 'Amalfi Golden'",
		priceSmall: 40,
		priceMedium: 60,
		priceLarge: 85,
		description:
			"Sun-bleached fluffy Italian pampas plumes paired with preserved golden palm leaves and fragrant dried cardamom stems.",
		category: "Dried Botanicals",
		symbolism: "Wanderlust, dry warmth, artistic freedom, and resilience.",
		careGuide:
			"Requires zero hydration. Avoid highly humid rooms to maximize fluffiness.",
		image:
			"https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
		popular: false,
	},
	{
		id: "celestial-hydrangea",
		name: "Celestial Blue Hydrangea Canopy",
		scientificName: "Hydrangea macrophylla 'Celestial Blue'",
		priceSmall: 65,
		priceMedium: 100,
		priceLarge: 150,
		description:
			"Enormous deep indigo and slate blue hydrangea globes coupled with emerald monstera and fresh silver dollar leaves.",
		category: "Exotics",
		symbolism: "Grace, heartfelt sincerity, and infinite depth of soul.",
		careGuide:
			"Spray petals directly with gentle mist occasionally since hydrangeas absorb moisture from their heads.",
		image:
			"https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "imperial-orchid",
		name: "Imperial Sapa Orchid Curation",
		scientificName: "Cymbidium erythrostylum 'Sapa Majestic'",
		priceSmall: 120,
		priceMedium: 190,
		priceLarge: 280,
		description:
			"Rare majestic white and pink cymbidium orchids sourced from the misty mountains of Sapa, coupled with delicate mountain ferns.",
		category: "Exotics",
		symbolism: "High prestige, eternal elegance, refined taste, and wisdom.",
		careGuide:
			"Spritz roots with fresh spring water. Maintain high humidity and bright indirect light.",
		image:
			"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "scarlet-dahlia",
		name: "Triumphant Scarlet Dahlia Cluster",
		scientificName: "Dahlia pinnata 'Scarlet Emperor'",
		priceSmall: 55,
		priceMedium: 80,
		priceLarge: 120,
		description:
			"Showstopping velvet scarlet-red dahlias paired with black baccara roses, forest greens, and dark chocolate cosmos details.",
		category: "Exotics",
		symbolism: "Inner strength, unwavering devotion, and artistic triumph.",
		careGuide:
			"Snip any low foliage; replace water with chilled floral solution every day.",
		image:
			"https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&q=80&w=600",
		popular: false,
	},
	{
		id: "pink-scent-tulip",
		name: "Imperial Dutch Pink Tulip Bouquet",
		scientificName: "Tulipa 'Angelique Double'",
		priceSmall: 60,
		priceMedium: 90,
		priceLarge: 130,
		description:
			"Double-fringed pastel pink tulips that mimic peonies in volume, layered with fluffy gypsophila and wild mint.",
		category: "Exotics",
		symbolism:
			"Perfect happiness, romantic imagination, and fresh spring cycles.",
		careGuide:
			"Keep in very cold shallow water. Tulips continue to grow towards light, keep rotated.",
		image:
			"https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&q=80&w=600",
		popular: true,
	},
	{
		id: "amethyst-statice",
		name: "Amethyst Preserved Meadow",
		scientificName: "Limonium sinuatum 'Amethyst Violet'",
		priceSmall: 45,
		priceMedium: 65,
		priceLarge: 90,
		description:
			"Crisp purple state statice and crisp dried yellow strawflowers, naturally preserved with baby blue premium mountain sage.",
		category: "Dried Botanicals",
		symbolism: "Long-lasting remembrance, sympathy, and mystical beauty.",
		careGuide:
			"Keep completely dry. Dust off lightly using a low velocity cool hair dryer.",
		image:
			"https://images.unsplash.com/photo-1735779411191-4a2f31a67686?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGFib3V0JTIwdXMlMjBmbG93ZXJ8ZW58MHwxfDB8fHwy",
		popular: false,
	},
];
