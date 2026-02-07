const mongoose = require("mongoose");
const Pet = require("../models/Pet");
const { env } = require("../config/env");

const pets = [
  // DOGS - 4
  {
    name: "Max",
    species: "dog",
    breed: "Golden Retriever",
    age: 3,
    description:
      "Golden Retriever with a friendly and energetic personality. Max loves playing fetch and swimming. Great with kids and other pets.",
    imageUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
    status: "available",
  },
  {
    name: "Luna",
    species: "dog",
    breed: "Labrador Retriever",
    age: 2,
    description:
      "Sweet Labrador puppy with boundless energy. Luna is intelligent, obedient, and loves outdoor adventures. Perfect family companion.",
    imageUrl: "https://images.unsplash.com/photo-1611003228941-98852ba62227",
    status: "available",
  },
  {
    name: "Charlie",
    species: "dog",
    breed: "German Shepherd",
    age: 5,
    description:
      "Intelligent and loyal German Shepherd. Charlie is well-trained, protective, and great for active families. Excellent watchdog.",
    imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
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

  // CATS - 4
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
    imageUrl: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8",
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

  // OTHERS - 4
  {
    name: "Hoppy",
    species: "other",
    breed: "Angora Rabbit",
    age: 2,
    description:
      "Fluffy Angora rabbit with soft white fur. Hoppy is gentle, enjoys hopping around, and loves fresh vegetables. Great starter pet.",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmeiAjKKM3mv94Eqw2QMe_NpWadXAm7DKISA&s",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ4kDD4o88G9nJHWtdyhqQ5q9718oujZ8mIg&s",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzYN_RlxqMOEUJPCjvHFgtYZhIhcnWJ5A1mg&s",
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
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWVsHNpO8dI4as4qqtxqd7HZsfC4wlRkWwBA&s",
    status: "available",
  },
];

const run = async () => {
  await mongoose.connect(env.MONGO_URI, { dbName: env.MONGO_DB_NAME });
  await Pet.deleteMany({});
  await Pet.insertMany(pets);
  await mongoose.disconnect();
  console.log("Seed complete");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
