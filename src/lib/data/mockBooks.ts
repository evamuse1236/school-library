import type { Book, Prompt } from '$lib/types';

// Default reflection prompts
export const defaultPrompts: Prompt[] = [
	{
		id: 'loved-line',
		label: 'One line I loved…',
		minWords: 20,
		maxWords: 40
	},
	{
		id: 'feelings',
		label: 'This story made me feel… because…',
		minWords: 40,
		maxWords: 70
	},
	{
		id: 'character-advice',
		label: 'If I could tell the main character one thing…',
		minWords: 30,
		maxWords: 60
	}
];

// Mock book data with diverse, inclusive content
export const mockBooks: Book[] = [
	{
		id: 'bfg-roald-dahl',
		title: 'The BFG',
		author: 'Roald Dahl',
		summary: 'A young girl and a kind giant set out on an adventure to save the world from mean giants. Full of whimsical language and friendship.',
		tags: ['Magical', 'Adventure', 'Funny'],
		driveUrl: 'https://drive.google.com/file/d/example-bfg/view',
		coverUrl: '/covers/bfg.jpg',
		format: 'book',
		pages: 195,
		prompts: [defaultPrompts[0], defaultPrompts[1]],
		createdAt: '2024-01-15T10:00:00Z'
	},
	{
		id: 'mystery-mill',
		title: 'Mystery at the Old Mill',
		author: 'Sara Johnson',
		summary: 'Two friends investigate strange happenings in an abandoned mill. A gentle mystery perfect for curious minds.',
		tags: ['Thinky', 'Adventure'],
		driveUrl: 'https://drive.google.com/file/d/example-mystery/view',
		coverUrl: '/covers/mystery-mill.jpg',
		format: 'book',
		pages: 120,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-01-20T14:30:00Z'
	},
	{
		id: 'enchanted-forest',
		title: 'The Enchanted Forest',
		author: 'Emily Carter',
		summary: 'A girl discovers a hidden, magical forest and must protect it from harm. Beautiful illustrations bring the magic to life.',
		tags: ['Magical', 'Adventure'],
		driveUrl: 'https://drive.google.com/file/d/example-forest/view',
		coverUrl: '/covers/enchanted-forest.jpg',
		format: 'book',
		pages: 160,
		prompts: [defaultPrompts[0], defaultPrompts[2]],
		createdAt: '2024-02-01T09:15:00Z'
	},
	{
		id: 'space-explorers',
		title: 'Space Explorers',
		author: 'John Lewis',
		summary: 'Join a group of young astronauts on their journey through the galaxy. Science meets adventure in this exciting tale.',
		tags: ['Adventure', 'Thinky'],
		driveUrl: 'https://drive.google.com/file/d/example-space/view',
		coverUrl: '/covers/space-explorers.jpg',
		format: 'book',
		pages: 180,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-02-10T16:45:00Z'
	},
	{
		id: 'joke-book',
		title: 'The Ultimate Joke Book',
		author: 'Naver Adams',
		summary: 'Hundreds of silly jokes, puns, and riddles to make you and your friends laugh out loud. Perfect for sharing!',
		tags: ['Funny', 'Short Reads'],
		driveUrl: 'https://drive.google.com/file/d/example-jokes/view',
		coverUrl: '/covers/joke-book.jpg',
		format: 'book',
		pages: 85,
		prompts: [defaultPrompts[0]],
		createdAt: '2024-02-15T11:20:00Z'
	},
	{
		id: 'island-adventure',
		title: 'Island Adventure',
		author: 'Mark Adams',
		summary: 'Stranded on a tropical island, three kids must work together to survive and find their way home. Teamwork and courage shine.',
		tags: ['Adventure', 'Thinky'],
		driveUrl: 'https://drive.google.com/file/d/example-island/view',
		coverUrl: '/covers/island-adventure.jpg',
		format: 'book',
		pages: 145,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-02-20T13:10:00Z'
	},
	{
		id: 'time-machine',
		title: 'The Time Machine',
		author: 'Jane Roberts',
		summary: 'A young inventor creates a time machine and travels through history. What will she discover in the past and future?',
		tags: ['Magical', 'Thinky', 'Adventure'],
		driveUrl: 'https://drive.google.com/file/d/example-time/view',
		coverUrl: '/covers/time-machine.jpg',
		format: 'book',
		pages: 200,
		prompts: [defaultPrompts[0], defaultPrompts[1]],
		createdAt: '2024-02-25T08:30:00Z'
	},
	{
		id: 'comic-heroes',
		title: "Let's Draw Comics",
		author: 'David Wong',
		summary: 'Learn to create your own comic book heroes and stories. Step-by-step guides with colorful examples and tips.',
		tags: ['Thinky', 'Funny'],
		driveUrl: 'https://drive.google.com/file/d/example-comics/view',
		coverUrl: '/covers/comic-heroes.jpg',
		format: 'comic',
		pages: 95,
		prompts: [defaultPrompts[0], defaultPrompts[2]],
		createdAt: '2024-03-01T15:00:00Z'
	},
	{
		id: 'animal-friends',
		title: 'Amazing Animal Friends',
		author: 'Dr. Lisa Park',
		summary: 'Discover incredible friendships between different animals in the wild. Real stories that will warm your heart.',
		tags: ['True Stories', 'Thinky'],
		driveUrl: 'https://drive.google.com/file/d/example-animals/view',
		coverUrl: '/covers/animal-friends.jpg',
		format: 'book',
		pages: 110,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-03-05T12:45:00Z'
	},
	{
		id: 'short-stories',
		title: 'Five-Minute Tales',
		author: 'Maria Santos',
		summary: 'Perfect bedtime stories that can be read in just five minutes. Sweet, gentle tales for winding down.',
		tags: ['Short Reads', 'Magical'],
		driveUrl: 'https://drive.google.com/file/d/example-tales/view',
		coverUrl: '/covers/short-stories.jpg',
		format: 'book',
		pages: 75,
		prompts: [defaultPrompts[0]],
		createdAt: '2024-03-10T17:20:00Z'
	},
	{
		id: 'ocean-adventure',
		title: 'Under the Ocean',
		author: 'Captain Blue',
		summary: 'Dive deep into the ocean and meet amazing sea creatures. An underwater adventure full of wonder and discovery.',
		tags: ['Adventure', 'True Stories'],
		driveUrl: 'https://drive.google.com/file/d/example-ocean/view',
		coverUrl: '/covers/ocean-adventure.jpg',
		format: 'book',
		pages: 130,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-03-15T10:30:00Z'
	},
	{
		id: 'funny-poems',
		title: 'Giggle and Rhyme',
		author: 'Poet Pete',
		summary: 'Silly poems that will make you laugh and maybe inspire you to write your own. Perfect for reading aloud!',
		tags: ['Funny', 'Short Reads'],
		driveUrl: 'https://drive.google.com/file/d/example-poems/view',
		coverUrl: '/covers/funny-poems.jpg',
		format: 'book',
		pages: 60,
		prompts: [defaultPrompts[0]],
		createdAt: '2024-03-20T14:15:00Z'
	},
	{
		id: 'dragon-friend',
		title: 'My Dragon Friend',
		author: 'Luna Kim',
		summary: 'A shy girl befriends a lonely dragon and learns that being different makes you special. A story about acceptance and friendship.',
		tags: ['Magical', 'Funny'],
		driveUrl: 'https://drive.google.com/file/d/example-dragon/view',
		coverUrl: '/covers/dragon-friend.jpg',
		format: 'book',
		pages: 140,
		prompts: [defaultPrompts[0], defaultPrompts[1]],
		createdAt: '2024-03-25T09:45:00Z'
	},
	{
		id: 'science-experiments',
		title: 'Cool Science at Home',
		author: 'Professor Smart',
		summary: 'Safe and fun science experiments you can do with things from around your house. Learn while you play!',
		tags: ['Thinky', 'True Stories'],
		driveUrl: 'https://drive.google.com/file/d/example-science/view',
		coverUrl: '/covers/science-experiments.jpg',
		format: 'book',
		pages: 105,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-04-01T11:00:00Z'
	},
	{
		id: 'superhero-comic',
		title: 'Captain Kindness',
		author: 'Comic Crew',
		summary: 'Follow Captain Kindness as she saves the day with acts of kindness instead of superpowers. A comic about being a hero every day.',
		tags: ['Funny', 'Adventure'],
		driveUrl: 'https://drive.google.com/file/d/example-kindness/view',
		coverUrl: '/covers/superhero-comic.jpg',
		format: 'comic',
		pages: 80,
		prompts: [defaultPrompts[0], defaultPrompts[2]],
		createdAt: '2024-04-05T16:30:00Z'
	},
	{
		id: 'nature-walk',
		title: 'A Walk in the Woods',
		author: 'Forest Ranger Sam',
		summary: 'Learn about the plants and animals you might see on a nature walk. Beautiful photos and interesting facts.',
		tags: ['True Stories', 'Thinky'],
		driveUrl: 'https://drive.google.com/file/d/example-nature/view',
		coverUrl: '/covers/nature-walk.jpg',
		format: 'book',
		pages: 90,
		prompts: [defaultPrompts[1]],
		createdAt: '2024-04-10T13:20:00Z'
	},
	{
		id: 'music-magic',
		title: 'The Magic of Music',
		author: 'Melody Maker',
		summary: 'A young musician discovers that her music has real magic powers. Can she use them to help her friends?',
		tags: ['Magical', 'Adventure'],
		driveUrl: 'https://drive.google.com/file/d/example-music/view',
		coverUrl: '/covers/music-magic.jpg',
		format: 'book',
		pages: 155,
		prompts: [defaultPrompts[0], defaultPrompts[1]],
		createdAt: '2024-04-15T08:45:00Z'
	},
	{
		id: 'quick-reads',
		title: 'Lightning Fast Stories',
		author: 'Speed Reader',
		summary: 'Ten exciting stories that can each be read in under ten minutes. Perfect for when you want a quick adventure!',
		tags: ['Short Reads', 'Adventure'],
		driveUrl: 'https://drive.google.com/file/d/example-quick/view',
		coverUrl: '/covers/quick-reads.jpg',
		format: 'book',
		pages: 70,
		prompts: [defaultPrompts[0]],
		createdAt: '2024-04-20T15:10:00Z'
	},
	{
		id: 'cooking-fun',
		title: 'Kids in the Kitchen',
		author: 'Chef Annie',
		summary: 'Simple, safe recipes that kids can make with help from grown-ups. Cooking is fun and delicious!',
		tags: ['Thinky', 'True Stories'],
		driveUrl: 'https://drive.google.com/file/d/example-cooking/view',
		coverUrl: '/covers/cooking-fun.jpg',
		format: 'book',
		pages: 95,
		prompts: [defaultPrompts[1], defaultPrompts[2]],
		createdAt: '2024-04-25T12:00:00Z'
	},
	{
		id: 'mystery-comic',
		title: 'Detective Dog',
		author: 'Mystery Comics',
		summary: 'A clever dog solves mysteries around the neighborhood with help from his human friends. Fun comic-style storytelling.',
		tags: ['Funny', 'Thinky'],
		driveUrl: 'https://drive.google.com/file/d/example-detective/view',
		coverUrl: '/covers/mystery-comic.jpg',
		format: 'comic',
		pages: 65,
		prompts: [defaultPrompts[0], defaultPrompts[2]],
		createdAt: '2024-05-01T10:15:00Z'
	}
];

// Helper function to get books by mood
export function getBooksByMood(mood: string): Book[] {
	return mockBooks.filter(book => book.tags.includes(mood));
}

// Helper function to get books by format
export function getBooksByFormat(format: string): Book[] {
	return mockBooks.filter(book => book.format === format);
}

// Helper function to get random book
export function getRandomBook(): Book {
	return mockBooks[Math.floor(Math.random() * mockBooks.length)];
}

// Helper function to get related books (same tags)
export function getRelatedBooks(book: Book, limit: number = 3): Book[] {
	const related = mockBooks
		.filter(b => b.id !== book.id && b.tags.some(tag => book.tags.includes(tag)))
		.sort(() => Math.random() - 0.5)
		.slice(0, limit);
	
	return related;
}