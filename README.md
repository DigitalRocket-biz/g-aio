# Google Ads Assistant

A Next.js application that helps manage and optimize Google Ads campaigns using AI assistance.

## Features

- AI-powered chat interface for Google Ads management
- Campaign performance analytics and visualization
- Automated optimization suggestions
- Real-time campaign monitoring

## Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Google Ads API access
- OpenAI API key

## Setup

1. Clone the repository:

```bash
git clone https://github.com/DigitalRocket-biz/g-aio.git
cd g-aio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your API keys and credentials

```bash
cp .env.example .env
```

4. Set up the database:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Environment Variables

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_ADS_CLIENT_ID`: Google Ads API client ID
- `GOOGLE_ADS_CLIENT_SECRET`: Google Ads API client secret
- `GOOGLE_ADS_DEVELOPER_TOKEN`: Google Ads API developer token
- `DATABASE_URL`: PostgreSQL database URL
- `NEXTAUTH_URL`: NextAuth.js URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: NextAuth.js secret key

See `.env.example` for all required environment variables.

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License