const mongoose = require("mongoose");
const Pet = require("../models/Pet");
const { env } = require("../config/env");

const PETS_API_KEY = process.env.PETS_API_KEY;

const dogs = [
  {
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    age: 0.6,
    description:
      "Golden Retriever with a friendly and energetic personality. Max loves playing fetch and swimming. Great with kids and other pets.",
    imageUrl:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=compress&cs=tinysrgb&w=1200",
    status: "available",
  },
  {
    name: "Luna",
    species: "dog",
    breed: "Labrador Retriever",
    age: 0.4,
    description:
      "Sweet Labrador puppy with boundless energy. Luna is intelligent, obedient, and loves outdoor adventures. Perfect family companion.",
    imageUrl:
      "https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=compress&cs=tinysrgb&w=1200",
    status: "available",
  },
  {
    name: "Charlie",
    species: "dog",
    breed: "German Shepherd",
    age: 5,
    description:
      "Intelligent and loyal German Shepherd. Charlie is well-trained, protective, and great for active families. Excellent watchdog.",
    imageUrl:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=compress&cs=tinysrgb&w=1200",
    status: "available",
  },
  {
    name: "Bailey",
    species: "dog",
    breed: "Beagle",
    age: 4,
    description:
      "Cute and compact Beagle with a big personality. Bailey is curious, friendly, and loves being part of family activities.",
    imageUrl: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9",
    status: "available",
  },
];

const cats = [
  {
    name: "Whiskers",
    species: "cat",
    breed: "Persian",
    age: 3,
    description:
      "Beautiful long-haired Persian cat with a calm and gentle demeanor. Whiskers enjoys peaceful environments and lots of affection.",
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    status: "available",
  },
  {
    name: "Simba",
    species: "cat",
    breed: "Maine Coon",
    age: 2,
    description:
      "Majestic Maine Coon kitten with a friendly personality. Simba is playful, intelligent, and one of the largest cat breeds.",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    status: "available",
  },
  {
    name: "Mittens",
    species: "cat",
    breed: "Siamese",
    age: 4,
    description:
      "Elegant Siamese cat with striking blue eyes. Mittens is vocal, social, and loves interacting with humans. Very affectionate.",
    imageUrl: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
    status: "available",
  },
  {
    name: "Shadow",
    species: "cat",
    breed: "Ragdoll",
    age: 1,
    description:
      "Fluffy Ragdoll kitten with soft blue-grey coloring. Shadow is calm, loving, and enjoys being held and cuddled by family members.",
    imageUrl: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e",
    status: "available",
  },
];

const otherPets = [
  {
    name: "Hoppy",
    species: "other",
    breed: "Angora Rabbit",
    age: 2,
    description:
      "Fluffy Angora rabbit with soft white fur. Hoppy is gentle, enjoys hopping around, and loves fresh vegetables. Great starter pet.",
    imageUrl:
      "https://media.istockphoto.com/id/610570778/photo/white-angora-rabbit-sitting-outdoors-in-the-wild-front-view.jpg?s=612x612&w=0&k=20&c=LTHbEgNoSGXfHSzYkspA6byheQi0BR0A17sgT7mIbds=",
    status: "available",
  },
  {
    name: "Polly",
    species: "other",
    breed: "African Grey Parrot",
    age: 8,
    description:
      "Intelligent and colorful African Grey Parrot. Polly can mimic words, learn tricks, and provide years of entertainment and companionship.",
    imageUrl:
      "https://media.istockphoto.com/id/1231125384/photo/congo-african-grey-parrot-portrait-isolated.jpg?s=612x612&w=0&k=20&c=5ZYqca0UYvt0yL4lvLOQUXIeElMsbFuZsW_5yo4XqbQ=",
    status: "available",
  },
  {
    name: "Squeaky",
    species: "other",
    breed: "Syrian Hamster",
    age: 1,
    description:
      "Adorable golden Syrian hamster full of personality. Squeaky loves running on wheels and exploring. Perfect for apartment living.",
    imageUrl:
      "https://images.pexels.com/photos/28749492/pexels-photo-28749492/free-photo-of-adorable-syrian-hamster-on-dark-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    status: "available",
  },
  {
    name: "Nibbles",
    species: "other",
    breed: "Guinea Pig",
    age: 3,
    description:
      "Friendly and social Guinea Pig with brown and white patches. Nibbles makes cute squeaking sounds and loves interacting with humans.",
    imageUrl:
      "https://images.unsplash.com/photo-1512087499053-023f060e2cea?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Z3VpbmVhJTIwcGlnfGVufDB8fDB8fHww",
    status: "available",
  },
];

const dogApiBase = "https://api.thedogapi.com/v1";
const catApiBase = "https://api.thecatapi.com/v1";

const fetchImageForBreed = async (apiBase, breedName, fallbackUrl) => {
  if (!PETS_API_KEY) {
    return fallbackUrl;
  }

  try {
    const searchRes = await fetch(
      `${apiBase}/breeds/search?q=${encodeURIComponent(breedName)}`,
      {
        headers: { "x-api-key": PETS_API_KEY },
      }
    );

    if (!searchRes.ok) {
      throw new Error(`Breed search ${searchRes.status}`);
    }

    const breeds = await searchRes.json();
    const breedId = breeds?.[0]?.id;
    if (!breedId) return fallbackUrl;

    const imageRes = await fetch(
      `${apiBase}/images/search?breed_id=${breedId}&limit=1`,
      {
        headers: { "x-api-key": PETS_API_KEY },
      }
    );

    if (!imageRes.ok) {
      throw new Error(`Image search ${imageRes.status}`);
    }

    const images = await imageRes.json();
    return images?.[0]?.url || fallbackUrl;
  } catch (error) {
    console.error(`API fetch failed for ${breedName}:`, error.message);
    return fallbackUrl;
  }
};

const run = async () => {
  await mongoose.connect(env.MONGO_URI, { dbName: env.MONGO_DB_NAME });
  await Pet.deleteMany({});
  const dogsWithImages = await Promise.all(
    dogs.map(async (pet) => ({
      ...pet,
      imageUrl: await fetchImageForBreed(dogApiBase, pet.breed, pet.imageUrl),
    }))
  );

  const catsWithImages = await Promise.all(
    cats.map(async (pet) => ({
      ...pet,
      imageUrl: await fetchImageForBreed(catApiBase, pet.breed, pet.imageUrl),
    }))
  );

  const pets = [...dogsWithImages, ...catsWithImages, ...otherPets];
  await Pet.insertMany(pets);
  await mongoose.disconnect();
  console.log("Seed complete");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
