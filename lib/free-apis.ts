// 160+ Free Public APIs - No Authentication Required
// All APIs are free and do not require credit card or API keys

export interface FreeAPI {
  id: string;
  name: string;
  category: string;
  description: string;
  baseUrl: string;
  sampleUrl: string;
  icon: string;
  cors: boolean;
}

export const FREE_API_CATEGORIES = [
  'art_images',
  'animals',
  'calendar',
  'content',
  'crypto_finance',
  'developer_tools',
  'food_drink',
  'fun_games',
  'geo',
  'government',
  'health',
  'inspiration',
  'jobs',
  'language',
  'music',
  'open_data',
  'science',
  'sports',
  'test_data',
  'transportation',
  'weather'
] as const;

export type APICategory = typeof FREE_API_CATEGORIES[number];

export const CATEGORY_NAMES: Record<APICategory, string> = {
  art_images: '艺术与图片',
  animals: '动物',
  calendar: '日历',
  content: '内容',
  crypto_finance: '加密货币与金融',
  developer_tools: '开发者工具',
  food_drink: '美食与饮品',
  fun_games: '趣味与游戏',
  geo: '地理',
  government: '政府',
  health: '健康',
  inspiration: '灵感',
  jobs: '工作',
  language: '语言',
  music: '音乐',
  open_data: '开放数据',
  science: '科学',
  sports: '体育',
  test_data: '测试数据',
  transportation: '交通',
  weather: '天气'
};

export const FREE_APIS: FreeAPI[] = [
  // Art & Images (15)
  { id: 'art-institute-chicago', name: 'Art Institute of Chicago', category: 'art_images', description: '芝加哥艺术学院藏品', baseUrl: 'https://api.artic.edu', sampleUrl: 'https://api.artic.edu/api/v1/artworks/search?q=cats', icon: '🎨', cors: true },
  { id: 'colourlovers', name: 'COLOURlovers', category: 'art_images', description: '颜色趋势', baseUrl: 'https://www.colourlovers.com', sampleUrl: 'https://www.colourlovers.com/api/colors/new?format=json', icon: '🎨', cors: true },
  { id: 'dicebear', name: 'DiceBear', category: 'art_images', description: '随机SVG头像生成', baseUrl: 'https://api.dicebear.com', sampleUrl: 'https://api.dicebear.com/6.x/pixel-art/svg', icon: '👤', cors: true },
  { id: 'dog-ceo', name: 'Dog CEO', category: 'art_images', description: '随机狗图片', baseUrl: 'https://dog.ceo', sampleUrl: 'https://dog.ceo/api/breeds/image/random', icon: '🐕', cors: true },
  { id: 'http-cats', name: 'HTTP Cats', category: 'art_images', description: 'HTTP状态码猫图', baseUrl: 'https://http.cat', sampleUrl: 'https://http.cat/401', icon: '🐱', cors: true },
  { id: 'lorem-picsum', name: 'Lorem Picsum', category: 'art_images', description: '占位图片', baseUrl: 'https://picsum.photos', sampleUrl: 'https://picsum.photos/200/300', icon: '🖼️', cors: true },
  { id: 'met-museum', name: 'Metropolitan Museum', category: 'art_images', description: '大都会博物馆藏品', baseUrl: 'https://collectionapi.metmuseum.org', sampleUrl: 'https://collectionapi.metmuseum.org/public/collection/v1/objects/100', icon: '🏛️', cors: true },
  { id: 'random-dog', name: 'Random Dog', category: 'art_images', description: '随机狗图片', baseUrl: 'https://random.dog', sampleUrl: 'https://random.dog/woof.json', icon: '🐶', cors: true },
  { id: 'random-fox', name: 'Random Fox', category: 'art_images', description: '随机狐狸图片', baseUrl: 'https://randomfox.ca', sampleUrl: 'https://randomfox.ca/floof/', icon: '🦊', cors: true },
  { id: 'robohash', name: 'RoboHash', category: 'art_images', description: '文本生成独特图像', baseUrl: 'https://robohash.org', sampleUrl: 'https://robohash.org/onerobot.png', icon: '🤖', cors: true },
  { id: 'placebear', name: 'Placebear', category: 'art_images', description: '熊图片占位符', baseUrl: 'https://placebear.com', sampleUrl: 'https://placebear.com/200/300', icon: '🐻', cors: true },
  { id: 'php-noise', name: 'PHP-Noise', category: 'art_images', description: '噪声背景生成', baseUrl: 'https://php-noise.com', sampleUrl: 'https://php-noise.com/noise.php?hex=FFFFFF&json', icon: '🌫️', cors: true },

  // Animals (5)
  { id: 'cat-facts', name: 'Cat Facts', category: 'animals', description: '每日猫咪趣闻', baseUrl: 'https://cat-fact.herokuapp.com', sampleUrl: 'https://cat-fact.herokuapp.com/facts/random', icon: '🐱', cors: true },
  { id: 'shibe-online', name: 'Shibe Online', category: 'animals', description: '柴犬图片', baseUrl: 'https://shibe.online', sampleUrl: 'https://shibe.online/api/shibes?count=1', icon: '🐕', cors: true },
  { id: 'random-duck', name: 'Random Duck', category: 'animals', description: '随机鸭子图片', baseUrl: 'https://random-d.uk', sampleUrl: 'https://random-d.uk/api/random', icon: '🦆', cors: true },
  { id: 'zoo-animals', name: 'Zoo Animals', category: 'animals', description: '动物园动物数据', baseUrl: 'https://zoo-animal-api.herokuapp.com', sampleUrl: 'https://zoo-animal-api.herokuapp.com/animals/rand', icon: '🦁', cors: true },
  { id: 'movebank', name: 'Movebank', category: 'animals', description: '动物追踪数据', baseUrl: 'https://www.movebank.org', sampleUrl: 'https://www.movebank.org/movebank/service/public/json?entity_type=study', icon: '🦅', cors: true },

  // Calendar (3)
  { id: 'nager-date', name: 'Nager.Date', category: 'calendar', description: '公共假期', baseUrl: 'https://date.nager.at', sampleUrl: 'https://date.nager.at/api/v2/publicholidays/2024/US', icon: '📅', cors: true },
  { id: 'uk-bank-holidays', name: 'UK Bank Holidays', category: 'calendar', description: '英国银行假日', baseUrl: 'https://www.gov.uk', sampleUrl: 'https://www.gov.uk/bank-holidays.json', icon: '🇬🇧', cors: true },
  { id: 'world-time', name: 'World Time', category: 'calendar', description: '世界时间', baseUrl: 'https://worldtimeapi.org', sampleUrl: 'https://worldtimeapi.org/api/timezone/Asia/Shanghai', icon: '🕐', cors: true },

  // Content (20)
  { id: 'hacker-news', name: 'Hacker News', category: 'content', description: 'Hacker News API', baseUrl: 'https://hacker-news.firebaseio.com', sampleUrl: 'https://hacker-news.firebaseio.com/v0/item/8863.json', icon: '📰', cors: true },
  { id: 'reddit', name: 'Reddit', category: 'content', description: 'Reddit公开内容', baseUrl: 'https://www.reddit.com', sampleUrl: 'https://www.reddit.com/r/programming/top.json?limit=10', icon: '👽', cors: true },
  { id: 'wikipedia', name: 'Wikipedia', category: 'content', description: '维基百科内容', baseUrl: 'https://en.wikipedia.org', sampleUrl: 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&titles=JavaScript&rvprop=content&format=json', icon: '📖', cors: true },
  { id: 'open-library', name: 'Open Library', category: 'content', description: '图书数据', baseUrl: 'https://openlibrary.org', sampleUrl: 'https://openlibrary.org/search.json?q=the+lord+of+the+rings', icon: '📚', cors: true },
  { id: 'rick-morty', name: 'Rick and Morty', category: 'content', description: '瑞克和莫蒂角色', baseUrl: 'https://rickandmortyapi.com', sampleUrl: 'https://rickandmortyapi.com/api/character/108', icon: '👴', cors: true },
  { id: 'star-wars', name: 'SWAPI', category: 'content', description: '星球大战数据', baseUrl: 'https://swapi.dev', sampleUrl: 'https://swapi.dev/api/planets/3/?format=json', icon: '⭐', cors: true },
  { id: 'jikan', name: 'Jikan', category: 'content', description: '动漫数据库', baseUrl: 'https://api.jikan.moe', sampleUrl: 'https://api.jikan.moe/v4/anime?q=naruto', icon: '🎌', cors: true },
  { id: 'tvmaze', name: 'TVMaze', category: 'content', description: '电视节目信息', baseUrl: 'https://api.tvmaze.com', sampleUrl: 'http://api.tvmaze.com/search/shows?q=golden%20girls', icon: '📺', cors: true },
  { id: 'final-space', name: 'Final Space', category: 'content', description: '太空终界数据', baseUrl: 'https://finalspaceapi.com', sampleUrl: 'https://finalspaceapi.com/api/v0/episode/', icon: '🚀', cors: true },
  { id: 'ice-fire', name: 'Ice and Fire', category: 'content', description: '冰与火之歌数据', baseUrl: 'https://anapioficeandfire.com', sampleUrl: 'https://anapioficeandfire.com/api/characters/581', icon: '🐺', cors: true },
  { id: 'mcu-countdown', name: 'MCU Countdown', category: 'content', description: '下一部MCU电影', baseUrl: 'https://www.whenisthenextmcufilm.com', sampleUrl: 'https://www.whenisthenextmcufilm.com/api', icon: '🦸', cors: true },
  { id: 'stapi', name: 'STAPI', category: 'content', description: '星际迷航数据', baseUrl: 'https://stapi.co', sampleUrl: 'https://stapi.co/api/v2/rest/spacecraft/search', icon: '🖖', cors: true },
  { id: 'wordpress', name: 'WordPress', category: 'content', description: 'WordPress文章', baseUrl: 'https://techcrunch.com', sampleUrl: 'https://techcrunch.com/wp-json/wp/v2/posts?per_page=10', icon: '📝', cors: true },
  { id: 'chronicling-america', name: 'Chronicling America', category: 'content', description: '美国历史报纸', baseUrl: 'https://chroniclingamerica.loc.gov', sampleUrl: 'https://chroniclingamerica.loc.gov/newspapers.json', icon: '📰', cors: true },
  { id: 'crossref', name: 'Crossref', category: 'content', description: '学术元数据', baseUrl: 'https://api.crossref.org', sampleUrl: 'https://api.crossref.org/journals?query=pharmacy+health', icon: '🎓', cors: true },

  // Crypto & Finance (20)
  { id: 'binance', name: 'Binance', category: 'crypto_finance', description: '24小时加密数据', baseUrl: 'https://api4.binance.com', sampleUrl: 'https://api4.binance.com/api/v3/ticker/24hr', icon: '💰', cors: true },
  { id: 'coinbase', name: 'CoinBase', category: 'crypto_finance', description: '货币代码', baseUrl: 'https://api.coinbase.com', sampleUrl: 'https://api.coinbase.com/v2/currencies', icon: '🪙', cors: true },
  { id: 'coincap', name: 'CoinCap', category: 'crypto_finance', description: '实时加密价格', baseUrl: 'https://api.coincap.io', sampleUrl: 'https://api.coincap.io/v2/assets', icon: '📈', cors: true },
  { id: 'coindesk', name: 'CoinDesk', category: 'crypto_finance', description: '比特币价格指数', baseUrl: 'https://api.coindesk.com', sampleUrl: 'https://api.coindesk.com/v1/bpi/currentprice.json', icon: '₿', cors: true },
  { id: 'coingecko', name: 'CoinGecko', category: 'crypto_finance', description: '加密市场数据', baseUrl: 'https://api.coingecko.com', sampleUrl: 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd', icon: '🦎', cors: true },
  { id: 'coinlore', name: 'CoinLore', category: 'crypto_finance', description: '加密市场数据', baseUrl: 'https://api.coinlore.net', sampleUrl: 'https://api.coinlore.net/api/tickers/', icon: '💎', cors: true },
  { id: 'coinmap', name: 'CoinMap', category: 'crypto_finance', description: '加密ATM', baseUrl: 'https://coinmap.org', sampleUrl: 'https://coinmap.org/api/v1/venues/', icon: '🏧', cors: true },
  { id: 'coinpaprika', name: 'Coinpaprika', category: 'crypto_finance', description: '加密货币数据', baseUrl: 'https://api.coinpaprika.com', sampleUrl: 'https://api.coinpaprika.com/v1/coins/btc-bitcoin', icon: '🌶️', cors: true },
  { id: 'currency-rates', name: 'Currency Rates', category: 'crypto_finance', description: '汇率', baseUrl: 'https://cdn.jsdelivr.net', sampleUrl: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json', icon: '💱', cors: true },
  { id: 'exchangerate-api', name: 'ExchangeRate-API', category: 'crypto_finance', description: '汇率', baseUrl: 'https://open.er-api.com', sampleUrl: 'https://open.er-api.com/v6/latest/USD', icon: '💵', cors: true },
  { id: 'geckoterminal', name: 'GeckoTerminal', category: 'crypto_finance', description: '加密数据', baseUrl: 'https://api.geckoterminal.com', sampleUrl: 'https://api.geckoterminal.com/api/v2/networks', icon: '🦎', cors: true },
  { id: 'gemini', name: 'Gemini', category: 'crypto_finance', description: '加密市场数据', baseUrl: 'https://api.gemini.com', sampleUrl: 'https://api.gemini.com/v2/ticker/btcusd', icon: '♊', cors: true },
  { id: 'kraken', name: 'Kraken', category: 'crypto_finance', description: '加密数据', baseUrl: 'https://api.kraken.com', sampleUrl: 'https://api.kraken.com/0/public/Trades?pair=ltcusd', icon: '🐙', cors: true },
  { id: 'kucoin', name: 'KuCoin', category: 'crypto_finance', description: '加密数据', baseUrl: 'https://api.kucoin.com', sampleUrl: 'https://api.kucoin.com/api/v1/market/stats?symbol=BTC-USDT', icon: '🟢', cors: true },
  { id: 'dex-screener', name: 'DEX Screener', category: 'crypto_finance', description: '区块链筛选器', baseUrl: 'https://api.dexscreener.com', sampleUrl: 'https://api.dexscreener.com/latest/dex/search?q=WBNB%20USDC', icon: '📊', cors: true },

  // Developer Tools (20)
  { id: 'agify', name: 'Agify', category: 'developer_tools', description: '根据名字预测年龄', baseUrl: 'https://api.agify.io', sampleUrl: 'https://api.agify.io?name=bella', icon: '🔮', cors: true },
  { id: 'genderize', name: 'Genderize', category: 'developer_tools', description: '根据名字预测性别', baseUrl: 'https://api.genderize.io', sampleUrl: 'https://api.genderize.io?name=scott', icon: '👤', cors: true },
  { id: 'nationalize', name: 'Nationalize', category: 'developer_tools', description: '根据名字预测国籍', baseUrl: 'https://api.nationalize.io', sampleUrl: 'https://api.nationalize.io?name=michael', icon: '🌍', cors: true },
  { id: 'ipify', name: 'IPify', category: 'developer_tools', description: '获取公共IP', baseUrl: 'https://api.ipify.org', sampleUrl: 'https://api.ipify.org?format=json', icon: '🌐', cors: true },
  { id: 'ip2location', name: 'IP2Location', category: 'developer_tools', description: '获取公共IP', baseUrl: 'https://api.ip2location.io', sampleUrl: 'https://api.ip2location.io/', icon: '📍', cors: true },
  { id: 'httpbin', name: 'HTTPBin', category: 'developer_tools', description: '检查用户代理', baseUrl: 'https://httpbin.org', sampleUrl: 'https://httpbin.org/get', icon: '🔧', cors: true },
  { id: 'goqr', name: 'goQR', category: 'developer_tools', description: '创建二维码', baseUrl: 'https://api.qrserver.com', sampleUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=https://google.com&size=100x100', icon: '📱', cors: true },
  { id: 'quickchart', name: 'QuickChart', category: 'developer_tools', description: '生成图表', baseUrl: 'https://quickchart.io', sampleUrl: 'https://quickchart.io/chart?c={type:%27bar%27,data:{labels:[2019,2020,2021],datasets:[{label:%27Users%27,data:[120,60,180]}]}}', icon: '📊', cors: true },
  { id: 'image-charts', name: 'Image-Charts', category: 'developer_tools', description: '图表图片', baseUrl: 'https://image-charts.com', sampleUrl: 'https://image-charts.com/chart?cht=p3&chs=700x100&chd=t:60,40&chl=Hello|World', icon: '📈', cors: true },
  { id: 'microlink', name: 'Microlink', category: 'developer_tools', description: 'URL元数据和截图', baseUrl: 'https://api.microlink.io', sampleUrl: 'https://api.microlink.io/?url=https://github.com', icon: '🔗', cors: true },
  { id: 'uuid-generator', name: 'UUID Generator', category: 'developer_tools', description: '生成UUID', baseUrl: 'https://www.uuidtools.com', sampleUrl: 'https://www.uuidtools.com/api/generate/v1/count/3', icon: '🆔', cors: true },
  { id: 'is-gd', name: 'is.gd', category: 'developer_tools', description: 'URL缩短器', baseUrl: 'https://is.gd', sampleUrl: 'https://is.gd/create.php?format=simple&url=www.example.com', icon: '🔗', cors: true },
  { id: 'serialif-color', name: 'Serialif Color', category: 'developer_tools', description: '颜色格式转换', baseUrl: 'https://color.serialif.com', sampleUrl: 'https://color.serialif.com/aquamarine', icon: '🎨', cors: true },
  { id: 'cloudflare-trace', name: 'Cloudflare Trace', category: 'developer_tools', description: '获取IP和UA', baseUrl: 'https://1.1.1.1', sampleUrl: 'https://1.1.1.1/cdn-cgi/trace', icon: '☁️', cors: true },
  { id: 'filterlists', name: 'FilterLists', category: 'developer_tools', description: '广告拦截器列表', baseUrl: 'https://filterlists.com', sampleUrl: 'https://filterlists.com/api/directory/lists', icon: '🛡️', cors: true },
  { id: 'google-favicons', name: 'Google Favicons', category: 'developer_tools', description: '获取网站图标', baseUrl: 'https://www.google.com', sampleUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=32', icon: '🔖', cors: true },

  // Food & Drink (8)
  { id: 'cocktail-db', name: 'Cocktail Database', category: 'food_drink', description: '鸡尾酒配方', baseUrl: 'https://www.thecocktaildb.com', sampleUrl: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita', icon: '🍸', cors: true },
  { id: 'open-brewery', name: 'Open Brewery DB', category: 'food_drink', description: '啤酒厂', baseUrl: 'https://api.openbrewerydb.org', sampleUrl: 'https://api.openbrewerydb.org/breweries', icon: '🍺', cors: true },
  { id: 'open-food-facts', name: 'Open Food Facts', category: 'food_drink', description: '食品产品数据', baseUrl: 'https://world.openfoodfacts.org', sampleUrl: 'https://world.openfoodfacts.org/api/v0/product/737628064502.json', icon: '🍔', cors: true },
  { id: 'whisky-hunter', name: 'Whisky Hunter', category: 'food_drink', description: '威士忌拍卖', baseUrl: 'https://whiskyhunter.net', sampleUrl: 'https://whiskyhunter.net/api/auctions_data/?format=json', icon: '🥃', cors: true },
  { id: 'edamam', name: 'Edamam Nutrition', category: 'food_drink', description: '营养数据', baseUrl: 'https://api.edamam.com', sampleUrl: 'https://api.edamam.com/api/food-database/v2/parser', icon: '🥗', cors: true },

  // Fun & Games (25)
  { id: 'joke-api', name: 'JokeAPI', category: 'fun_games', description: '笑话', baseUrl: 'https://v2.jokeapi.dev', sampleUrl: 'https://v2.jokeapi.dev/joke/Any?safe-mode', icon: '😂', cors: true },
  { id: 'chuck-norris', name: 'Chuck Norris Jokes', category: 'fun_games', description: '查克·诺里斯笑话', baseUrl: 'https://api.chucknorris.io', sampleUrl: 'https://api.chucknorris.io/jokes/random', icon: '👊', cors: true },
  { id: 'dad-jokes', name: 'Dad Jokes', category: 'fun_games', description: '爸爸笑话', baseUrl: 'https://icanhazdadjoke.com', sampleUrl: 'https://icanhazdadjoke.com/', icon: '👨', cors: true },
  { id: 'official-joke', name: 'Official Joke', category: 'fun_games', description: '笑话', baseUrl: 'https://official-joke-api.appspot.com', sampleUrl: 'https://official-joke-api.appspot.com/random_joke', icon: '🃏', cors: true },
  { id: 'open-trivia', name: 'Open Trivia DB', category: 'fun_games', description: '问答题', baseUrl: 'https://opentdb.com', sampleUrl: 'https://opentdb.com/api.php?amount=10&category=17&difficulty=easy', icon: '❓', cors: true },
  { id: 'pokemon', name: 'PokéAPI', category: 'fun_games', description: '宝可梦数据', baseUrl: 'https://pokeapi.co', sampleUrl: 'https://pokeapi.co/api/v2/pokemon/ditto', icon: '⚡', cors: true },
  { id: 'pokemon-tcg', name: 'Pokémon TCG', category: 'fun_games', description: '宝可梦卡牌', baseUrl: 'https://api.pokemontcg.io', sampleUrl: 'https://api.pokemontcg.io/v2/cards/xy1-1', icon: '🎴', cors: true },
  { id: 'mtg', name: 'Magic: The Gathering', category: 'fun_games', description: 'MTG卡牌', baseUrl: 'https://api.magicthegathering.io', sampleUrl: 'https://api.magicthegathering.io/v1/sets', icon: '🧙', cors: true },
  { id: 'scryfall', name: 'Scryfall', category: 'fun_games', description: 'MTG卡牌数据', baseUrl: 'https://api.scryfall.com', sampleUrl: 'https://api.scryfall.com/cards/search?order=cmc&q=c:red%20pow=3', icon: '🔮', cors: true },
  { id: 'deck-cards', name: 'Deck of Cards', category: 'fun_games', description: '模拟纸牌', baseUrl: 'https://deckofcardsapi.com', sampleUrl: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1', icon: '🎰', cors: true },
  { id: 'dnd-5e', name: 'D&D 5th Edition', category: 'fun_games', description: 'D&D数据', baseUrl: 'https://www.dnd5eapi.co', sampleUrl: 'https://www.dnd5eapi.co/api/features', icon: '🎲', cors: true },
  { id: 'imgflip', name: 'Imgflip', category: 'fun_games', description: '热门表情包', baseUrl: 'https://api.imgflip.com', sampleUrl: 'https://api.imgflip.com/get_memes', icon: '😆', cors: true },
  { id: 'xkcd', name: 'xkcd', category: 'fun_games', description: 'xkcd漫画', baseUrl: 'https://xkcd.com', sampleUrl: 'https://xkcd.com/info.0.json', icon: '📰', cors: true },
  { id: 'yes-no', name: 'Yes or No', category: 'fun_games', description: '随机是否', baseUrl: 'https://yesno.wtf', sampleUrl: 'https://yesno.wtf/api', icon: '❔', cors: true },
  { id: 'is-even', name: 'isEven', category: 'fun_games', description: '检查偶数', baseUrl: 'https://api.isevenapi.xyz', sampleUrl: 'https://api.isevenapi.xyz/api/iseven/12/', icon: '🔢', cors: true },
  { id: 'evil-insult', name: 'Evil Insult', category: 'fun_games', description: '生成侮辱', baseUrl: 'https://evilinsult.com', sampleUrl: 'https://evilinsult.com/generate_insult.php?lang=en&type=json', icon: '😈', cors: true },
  { id: 'amiibo', name: 'AmiiboAPI', category: 'fun_games', description: '任天堂Amiibo', baseUrl: 'https://www.amiiboapi.com', sampleUrl: 'https://www.amiiboapi.com/api/amiibo/?name=mario', icon: '🎮', cors: true },
  { id: 'cheapshark', name: 'CheapShark', category: 'fun_games', description: '游戏价格对比', baseUrl: 'https://www.cheapshark.com', sampleUrl: 'https://www.cheapshark.com/api/1.0/deals?upperPrice=15', icon: '🎮', cors: true },
  { id: 'freetogame', name: 'FreeToGame', category: 'fun_games', description: '免费游戏', baseUrl: 'https://www.freetogame.com', sampleUrl: 'https://www.freetogame.com/api/games?platform=pc', icon: '🎮', cors: true },
  { id: 'gamerpower', name: 'Gamerpower', category: 'fun_games', description: '免费游戏赠品', baseUrl: 'https://www.gamerpower.com', sampleUrl: 'https://www.gamerpower.com/api/giveaways?platform=steam', icon: '🎁', cors: true },
  { id: 'hyrule', name: 'Hyrule Compendium', category: 'fun_games', description: '塞尔达传说数据', baseUrl: 'https://botw-compendium.herokuapp.com', sampleUrl: 'https://botw-compendium.herokuapp.com/api/v2/entry/white-maned_lynel', icon: '🗡️', cors: true },
  { id: 'league-legends', name: 'Data Dragon', category: 'fun_games', description: '英雄联盟数据', baseUrl: 'https://ddragon.leagueoflegends.com', sampleUrl: 'https://ddragon.leagueoflegends.com/cdn/14.3.1/data/en_US/champion.json', icon: '⚔️', cors: true },
  { id: 'runescape', name: 'RuneScape', category: 'fun_games', description: 'RuneScape数据', baseUrl: 'https://services.runescape.com', sampleUrl: 'https://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=9&alpha=c&page=1', icon: '🏰', cors: true },

  // Geo (15)
  { id: 'country-is', name: 'Country.is', category: 'geo', description: '根据IP查国家', baseUrl: 'https://api.country.is', sampleUrl: 'https://api.country.is/9.9.9.9', icon: '🌍', cors: true },
  { id: 'geojs', name: 'GeoJS', category: 'geo', description: 'IP地理定位', baseUrl: 'https://get.geojs.io', sampleUrl: 'https://get.geojs.io/v1/ip/geo.json', icon: '📍', cors: true },
  { id: 'ipapi', name: 'ipapi', category: 'geo', description: 'IP地理定位', baseUrl: 'https://ipapi.co', sampleUrl: 'https://ipapi.co/json/', icon: '🌐', cors: true },
  { id: 'nominatim', name: 'Nominatim', category: 'geo', description: '地址和位置', baseUrl: 'https://nominatim.openstreetmap.org', sampleUrl: 'https://nominatim.openstreetmap.org/search.php?city=taipei&format=jsonv2', icon: '🗺️', cors: true },
  { id: 'zippopotamus', name: 'Zippopotamus', category: 'geo', description: '60国邮编信息', baseUrl: 'https://api.zippopotam.us', sampleUrl: 'https://api.zippopotam.us/us/90210', icon: '📮', cors: true },
  { id: 'postcodes', name: 'Postcodes.io', category: 'geo', description: '英国邮编数据', baseUrl: 'https://api.postcodes.io', sampleUrl: 'https://api.postcodes.io/postcodes/OX49%205NU', icon: '🇬🇧', cors: true },
  { id: 'viacep', name: 'ViaCEP', category: 'geo', description: '巴西邮编', baseUrl: 'https://viacep.com.br', sampleUrl: 'https://viacep.com.br/ws/01001000/json/', icon: '🇧🇷', cors: true },
  { id: 'open-topo', name: 'Open Topo Data', category: 'geo', description: '海拔数据', baseUrl: 'https://api.opentopodata.org', sampleUrl: 'https://api.opentopodata.org/v1/srtm90m?locations=-43.5,172.5', icon: '⛰️', cors: true },
  { id: 'adresse-gouv', name: 'Adresse.data.gouv', category: 'geo', description: '法国地址', baseUrl: 'https://api-adresse.data.gouv.fr', sampleUrl: 'https://api-adresse.data.gouv.fr/search/?q=8+bd+du+port', icon: '🇫🇷', cors: true },
  { id: 'hong-kong-geo', name: 'Hong Kong GeoData', category: 'geo', description: '香港地理数据', baseUrl: 'https://geodata.gov.hk', sampleUrl: 'https://geodata.gov.hk/gs/api/v1.0.0/locationSearch?q=museums', icon: '🇭🇰', cors: true },

  // Government (10)
  { id: 'fbi-wanted', name: 'FBI Wanted', category: 'government', description: 'FBI通缉数据', baseUrl: 'https://api.fbi.gov', sampleUrl: 'https://api.fbi.gov/wanted/v1/list', icon: '🕵️', cors: true },
  { id: 'data-usa', name: 'Data USA', category: 'government', description: '美国公共数据', baseUrl: 'https://datausa.io', sampleUrl: 'https://datausa.io/api/data?drilldowns=Nation&measures=Population', icon: '🇺🇸', cors: true },
  { id: 'world-bank', name: 'World Bank', category: 'government', description: '世界银行数据', baseUrl: 'http://api.worldbank.org', sampleUrl: 'http://api.worldbank.org/v2/region?format=json', icon: '🏦', cors: true },
  { id: 'federal-register', name: 'Federal Register', category: 'government', description: '美国联邦公报', baseUrl: 'https://www.federalregister.gov', sampleUrl: 'https://www.federalregister.gov/api/v1/documents.json?per_page=5', icon: '📜', cors: true },
  { id: 'usaspending', name: 'USAspending', category: 'government', description: '美国联邦支出', baseUrl: 'https://api.usaspending.gov', sampleUrl: 'https://api.usaspending.gov/api/v2/references/toptier_agencies/', icon: '💵', cors: true },
  { id: 'brasil', name: 'Brasil API', category: 'government', description: '巴西公共数据', baseUrl: 'https://brasilapi.com.br', sampleUrl: 'https://brasilapi.com.br/api/feriados/v1/2024', icon: '🇧🇷', cors: true },
  { id: 'uk-police', name: 'UK Police', category: 'government', description: '英国犯罪数据', baseUrl: 'https://data.police.uk', sampleUrl: 'https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2023-01', icon: '🚔', cors: true },
  { id: 'nyc-open-data', name: 'NYC Open Data', category: 'government', description: '纽约市数据', baseUrl: 'https://data.cityofnewyork.us', sampleUrl: 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?unique_key=57056073', icon: '🗽', cors: true },

  // Health (5)
  { id: 'healthcare-gov', name: 'HealthCare.gov', category: 'health', description: '美国健康保险', baseUrl: 'https://www.healthcare.gov', sampleUrl: 'https://www.healthcare.gov/api/index.json', icon: '🏥', cors: true },
  { id: 'openfda', name: 'openFDA', category: 'health', description: 'FDA数据', baseUrl: 'https://api.fda.gov', sampleUrl: 'https://api.fda.gov/food/enforcement.json?limit=10', icon: '💊', cors: true },
  { id: 'nppes', name: 'NPPES', category: 'health', description: '美国医疗提供者', baseUrl: 'https://npiregistry.cms.hhs.gov', sampleUrl: 'https://npiregistry.cms.hhs.gov/api/?version=2.1&city=baltimore', icon: '👨‍⚕️', cors: true },
  { id: 'makeup', name: 'Makeup API', category: 'health', description: '化妆品信息', baseUrl: 'http://makeup-api.herokuapp.com', sampleUrl: 'http://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline', icon: '💄', cors: true },

  // Inspiration (12)
  { id: 'advice-slip', name: 'Advice Slip', category: 'inspiration', description: '随机建议', baseUrl: 'https://api.adviceslip.com', sampleUrl: 'https://api.adviceslip.com/advice', icon: '💡', cors: true },
  { id: 'affirmations', name: 'Affirmations', category: 'inspiration', description: '积极肯定', baseUrl: 'https://www.affirmations.dev', sampleUrl: 'https://www.affirmations.dev/', icon: '✨', cors: true },
  { id: 'quotable', name: 'Quotable', category: 'inspiration', description: '随机名言', baseUrl: 'https://api.quotable.io', sampleUrl: 'https://api.quotable.io/quotes/random', icon: '💬', cors: true },
  { id: 'quote-garden', name: 'Quote Garden', category: 'inspiration', description: '75000条名言', baseUrl: 'https://quote-garden.onrender.com', sampleUrl: 'https://quote-garden.onrender.com/api/v3/quotes', icon: '🌱', cors: true },
  { id: 'quotes-design', name: 'Quotes on Design', category: 'inspiration', description: '设计名言', baseUrl: 'https://quotesondesign.com', sampleUrl: 'https://quotesondesign.com/wp-json/wp/v2/posts/?orderby=rand', icon: '🎨', cors: true },
  { id: 'kanye', name: 'Kanye Quotes', category: 'inspiration', description: 'Kanye名言', baseUrl: 'https://api.kanye.rest', sampleUrl: 'https://api.kanye.rest/', icon: '🎤', cors: true },
  { id: 'breaking-bad', name: 'Breaking Bad Quotes', category: 'inspiration', description: '绝命毒师名言', baseUrl: 'https://api.breakingbadquotes.xyz', sampleUrl: 'https://api.breakingbadquotes.xyz/v1/quotes', icon: '🧪', cors: true },
  { id: 'got-quotes', name: 'GoT Quotes', category: 'inspiration', description: '权力的游戏名言', baseUrl: 'https://api.gameofthronesquotes.xyz', sampleUrl: 'https://api.gameofthronesquotes.xyz/v1/random', icon: '🐺', cors: true },
  { id: 'ron-swanson', name: 'Ron Swanson', category: 'inspiration', description: 'Ron Swanson名言', baseUrl: 'https://ron-swanson-quotes.herokuapp.com', sampleUrl: 'https://ron-swanson-quotes.herokuapp.com/v2/quotes', icon: '🥓', cors: true },
  { id: 'dictum', name: 'Dictum', category: 'inspiration', description: '励志格言', baseUrl: 'https://api.fisenko.net', sampleUrl: 'https://api.fisenko.net/v1/quotes/en?limit=5', icon: '📖', cors: true },

  // Language (6)
  { id: 'free-dictionary', name: 'Free Dictionary', category: 'language', description: '词汇定义', baseUrl: 'https://api.dictionaryapi.dev', sampleUrl: 'https://api.dictionaryapi.dev/api/v2/entries/en/digital', icon: '📚', cors: true },
  { id: 'datamuse', name: 'Datamuse', category: 'language', description: '词汇查询', baseUrl: 'https://api.datamuse.com', sampleUrl: 'https://api.datamuse.com/words?ml=ringing+in+the+ears', icon: '🔤', cors: true },
  { id: 'purgomalum', name: 'PurgoMalum', category: 'language', description: '敏感词检测', baseUrl: 'https://www.purgomalum.com', sampleUrl: 'https://www.purgomalum.com/service/json?text=this%20is%20some%20test%20input', icon: '🚫', cors: true },
  { id: 'chinese-text', name: 'Chinese Text Project', category: 'language', description: '古文数字图书馆', baseUrl: 'https://api.ctext.org', sampleUrl: 'https://api.ctext.org/getdictionaryheadwords', icon: '🀄', cors: true },

  // Music (5)
  { id: 'itunes', name: 'iTunes Search', category: 'music', description: 'iTunes内容', baseUrl: 'https://itunes.apple.com', sampleUrl: 'https://itunes.apple.com/search?term=radiohead', icon: '🎵', cors: true },
  { id: 'musicbrainz', name: 'MusicBrainz', category: 'music', description: '音乐数据', baseUrl: 'https://musicbrainz.org', sampleUrl: 'https://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?fmt=json', icon: '🎸', cors: true },
  { id: 'binary-jazz', name: 'Binary Jazz', category: 'music', description: '随机音乐流派', baseUrl: 'https://binaryjazz.us', sampleUrl: 'https://binaryjazz.us/wp-json/genrenator/v1/genre/5', icon: '🎹', cors: true },
  { id: 'openwhyd', name: 'Openwhyd', category: 'music', description: '流媒体播放列表', baseUrl: 'https://openwhyd.org', sampleUrl: 'https://openwhyd.org/hot/electro?format=json', icon: '🎧', cors: true },

  // Open Data (10)
  { id: 'archive-org', name: 'Archive.org', category: 'open_data', description: '数字档案', baseUrl: 'https://archive.org', sampleUrl: 'https://archive.org/metadata/TheAdventuresOfTomSawyer_201303', icon: '📁', cors: true },
  { id: 'wayback', name: 'Wayback Machine', category: 'open_data', description: '网页存档', baseUrl: 'https://archive.org', sampleUrl: 'https://archive.org/wayback/available?url=google.com', icon: '⏪', cors: true },
  { id: 'universities', name: 'Universities List', category: 'open_data', description: '全球大学', baseUrl: 'http://universities.hipolabs.com', sampleUrl: 'http://universities.hipolabs.com/search?country=United+Kingdom', icon: '🎓', cors: true },
  { id: 'wikipedia-stats', name: 'Wikipedia Stats', category: 'open_data', description: '维基页面统计', baseUrl: 'https://wikimedia.org', sampleUrl: 'https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/JavaScript/daily/20210901/20210930', icon: '📊', cors: true },
  { id: 'vehicles', name: 'NHTSA Vehicles', category: 'open_data', description: '车辆规格', baseUrl: 'https://vpic.nhtsa.dot.gov', sampleUrl: 'https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMake/merc?format=json', icon: '🚗', cors: true },
  { id: 'carbon-intensity', name: 'Carbon Intensity', category: 'open_data', description: '英国碳排放', baseUrl: 'https://api.carbonintensity.org.uk', sampleUrl: 'https://api.carbonintensity.org.uk/intensity/date', icon: '🌿', cors: true },
  { id: 'house-stock', name: 'House Stock Watcher', category: 'open_data', description: '国会成员股票', baseUrl: 'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com', sampleUrl: 'https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/filemap.xml', icon: '📈', cors: true },

  // Science (15)
  { id: 'nasa', name: 'NASA', category: 'science', description: 'NASA数据', baseUrl: 'https://api.nasa.gov', sampleUrl: 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY', icon: '🚀', cors: true },
  { id: 'spacex', name: 'SpaceX', category: 'science', description: 'SpaceX数据', baseUrl: 'https://api.spacexdata.com', sampleUrl: 'https://api.spacexdata.com/v5/launches/latest', icon: '🛸', cors: true },
  { id: 'open-notify', name: 'Open Notify', category: 'science', description: '太空人员', baseUrl: 'http://api.open-notify.org', sampleUrl: 'http://api.open-notify.org/astros.json', icon: '👨‍🚀', cors: true },
  { id: 'spaceflight-news', name: 'Spaceflight News', category: 'science', description: '太空新闻', baseUrl: 'https://api.spaceflightnewsapi.net', sampleUrl: 'https://api.spaceflightnewsapi.net/v3/articles', icon: '📰', cors: true },
  { id: 'spacedevs', name: 'TheSpaceDevs', category: 'science', description: '火箭发射', baseUrl: 'https://ll.thespacedevs.com', sampleUrl: 'https://ll.thespacedevs.com/2.2.0/agencies/?limit=10', icon: '🚀', cors: true },
  { id: 'usgs-earthquake', name: 'USGS Earthquake', category: 'science', description: '地震数据', baseUrl: 'https://earthquake.usgs.gov', sampleUrl: 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2023-03-01&endtime=2023-03-02&minmagnitude=5', icon: '🌋', cors: true },
  { id: 'sunrise-sunset', name: 'Sunrise Sunset', category: 'science', description: '日出日落', baseUrl: 'https://api.sunrisesunset.io', sampleUrl: 'https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873', icon: '🌅', cors: true },
  { id: 'numbers', name: 'Numbers API', category: 'science', description: '数字趣事', baseUrl: 'http://numbersapi.com', sampleUrl: 'http://numbersapi.com/random/math', icon: '🔢', cors: true },
  { id: 'newton', name: 'Newton', category: 'science', description: '高级数学', baseUrl: 'https://newton.now.sh', sampleUrl: 'https://newton.now.sh/api/v2/factor/x^2-1', icon: '🧮', cors: true },
  { id: 'arxiv', name: 'arXiv', category: 'science', description: '科研论文', baseUrl: 'http://export.arxiv.org', sampleUrl: 'http://export.arxiv.org/api/query?search_query=all:electron', icon: '📄', cors: true },
  { id: 'gbif', name: 'GBIF', category: 'science', description: '生物多样性', baseUrl: 'https://api.gbif.org', sampleUrl: 'https://api.gbif.org/v1/occurrence/search?year=1800,1899', icon: '🦋', cors: true },
  { id: 'arcsecond', name: 'Arcsecond', category: 'science', description: '天文数据', baseUrl: 'https://api.arcsecond.io', sampleUrl: 'https://api.arcsecond.io/activities/', icon: '🔭', cors: true },
  { id: 'celestrak', name: 'CelesTrak', category: 'science', description: '卫星轨道数据', baseUrl: 'https://celestrak.org', sampleUrl: 'https://celestrak.org/NORAD/elements/gp.php?INTDES=2023-015&FORMAT=JSON-PRETTY', icon: '🛰️', cors: true },

  // Sports (5)
  { id: 'citybikes', name: 'CityBikes', category: 'sports', description: '共享单车网络', baseUrl: 'http://api.citybik.es', sampleUrl: 'http://api.citybik.es/v2/networks', icon: '🚲', cors: true },
  { id: 'ergast-f1', name: 'Ergast F1', category: 'sports', description: '赛车数据', baseUrl: 'http://ergast.com', sampleUrl: 'http://ergast.com/api/f1/drivers.json', icon: '🏎️', cors: true },
  { id: 'football-data', name: 'Football-Data', category: 'sports', description: '足球数据', baseUrl: 'https://api.football-data.org', sampleUrl: 'https://api.football-data.org/v4/competitions/', icon: '⚽', cors: true },
  { id: 'nhl', name: 'NHL API', category: 'sports', description: 'NHL数据', baseUrl: 'https://api-web.nhle.com', sampleUrl: 'https://api-web.nhle.com/v1/standings-season', icon: '🏒', cors: true },

  // Test Data (10)
  { id: 'jsonplaceholder', name: 'JSONPlaceholder', category: 'test_data', description: '假REST API', baseUrl: 'https://jsonplaceholder.typicode.com', sampleUrl: 'https://jsonplaceholder.typicode.com/posts/1', icon: '🧪', cors: true },
  { id: 'random-user', name: 'RandomUser', category: 'test_data', description: '假用户数据', baseUrl: 'https://randomuser.me', sampleUrl: 'https://randomuser.me/api/', icon: '👤', cors: true },
  { id: 'faker', name: 'Faker API', category: 'test_data', description: '生成假数据', baseUrl: 'https://fakerapi.it', sampleUrl: 'https://fakerapi.it/api/v1/credit_cards?_quantity=2', icon: '🎭', cors: true },
  { id: 'reqres', name: 'Reqres', category: 'test_data', description: '测试API', baseUrl: 'https://reqres.in', sampleUrl: 'https://reqres.in/api/users?page=1', icon: '🔄', cors: true },
  { id: 'rest-api', name: 'REST API', category: 'test_data', description: 'REST测试', baseUrl: 'https://api.restful-api.dev', sampleUrl: 'https://api.restful-api.dev/objects', icon: '🌐', cors: true },
  { id: 'bacon-ipsum', name: 'Bacon Ipsum', category: 'test_data', description: '假文本生成', baseUrl: 'https://baconipsum.com', sampleUrl: 'https://baconipsum.com/api/?type=meat-and-filler', icon: '🥓', cors: true },
  { id: 'loripsum', name: 'Loripsum', category: 'test_data', description: '占位文本', baseUrl: 'https://loripsum.net', sampleUrl: 'https://loripsum.net/api/10/short/headers', icon: '📝', cors: true },
  { id: 'softwium', name: 'Softwium', category: 'test_data', description: '假JSON数据', baseUrl: 'https://softwium.com', sampleUrl: 'https://softwium.com/api/books', icon: '📚', cors: true },

  // Transportation (5)
  { id: 'berlin-transport', name: 'Berlin Transport', category: 'transportation', description: '柏林公交', baseUrl: 'https://v6.vbb.transport.rest', sampleUrl: 'https://v6.vbb.transport.rest/locations?query=berlin', icon: '🚌', cors: true },
  { id: 'irail', name: 'iRail', category: 'transportation', description: '比利时铁路', baseUrl: 'https://api.irail.be', sampleUrl: 'https://api.irail.be/stations/?format=json&lang=en', icon: '🚆', cors: true },
  { id: 'mbta', name: 'MBTA', category: 'transportation', description: '波士顿公交', baseUrl: 'https://api-v3.mbta.com', sampleUrl: 'https://api-v3.mbta.com/routes', icon: '🚇', cors: true },
  { id: 'metro-lisboa', name: 'Metro Lisboa', category: 'transportation', description: '里斯本地铁', baseUrl: 'https://app.metrolisboa.pt', sampleUrl: 'https://app.metrolisboa.pt/status/getLinhas.php', icon: '🚊', cors: true },

  // Weather (8)
  { id: 'open-meteo', name: 'Open-Meteo', category: 'weather', description: '开源天气API', baseUrl: 'https://api.open-meteo.com', sampleUrl: 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min', icon: '🌤️', cors: true },
  { id: '7timer', name: '7Timer!', category: 'weather', description: '天文天气预报', baseUrl: 'http://www.7timer.info', sampleUrl: 'http://www.7timer.info/bin/api.pl?lon=113.17&lat=23.09&product=astro&output=json', icon: '🌙', cors: true },
  { id: 'wttr', name: 'wttr.in', category: 'weather', description: '控制台天气', baseUrl: 'https://wttr.in', sampleUrl: 'https://wttr.in/Beijing?format=j1', icon: '⛅', cors: true },
  { id: 'aviation-weather', name: 'Aviation Weather', category: 'weather', description: '航空天气', baseUrl: 'https://aviationweather.gov', sampleUrl: 'https://aviationweather.gov/api/data/airport?ids=KMCI', icon: '✈️', cors: true },
  { id: 'opensensemap', name: 'openSenseMap', category: 'weather', description: '个人气象站', baseUrl: 'https://api.opensensemap.org', sampleUrl: 'https://api.opensensemap.org/boxes/57000b8745fd40c8196ad04c?format=json', icon: '📡', cors: true },
  { id: 'sg-weather', name: 'SG Weather', category: 'weather', description: '新加坡天气', baseUrl: 'https://api.data.gov.sg', sampleUrl: 'https://api.data.gov.sg/v1/environment/air-temperature', icon: '🇸🇬', cors: true },
];

// API 调用工具函数
export async function callFreeAPI(api: FreeAPI, customUrl?: string): Promise<any> {
  const url = customUrl || api.sampleUrl;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error(`Error calling API ${api.name}:`, error);
    throw error;
  }
}

// 获取所有类别
export function getCategories(): { id: APICategory; name: string; count: number }[] {
  return FREE_API_CATEGORIES.map(cat => ({
    id: cat,
    name: CATEGORY_NAMES[cat],
    count: FREE_APIS.filter(api => api.category === cat).length
  }));
}

// 根据类别获取API
export function getAPIsByCategory(category: APICategory): FreeAPI[] {
  return FREE_APIS.filter(api => api.category === category);
}

// 搜索API
export function searchAPIs(query: string): FreeAPI[] {
  const lowerQuery = query.toLowerCase();
  return FREE_APIS.filter(api => 
    api.name.toLowerCase().includes(lowerQuery) ||
    api.description.toLowerCase().includes(lowerQuery) ||
    api.category.toLowerCase().includes(lowerQuery)
  );
}

// 获取随机API
export function getRandomAPI(): FreeAPI {
  return FREE_APIS[Math.floor(Math.random() * FREE_APIS.length)];
}

// 总API数量
export const TOTAL_API_COUNT = FREE_APIS.length;
