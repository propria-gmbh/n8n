# Nutrition, Workout & Migraine Tracker via Telegram & n8n

## Overview
This project sets up a system to track nutrition, workouts, and migraines using Telegram as the interface, n8n as the orchestrator, and Airtable as the database.

## Architecture
- **Interface**: Telegram Bot
- **Orchestrator**: n8n
- **Storage**: Airtable
- **AI**: OpenAI (Speech-to-Text, Vision, Text Parsing)

## Prerequisites
1. **Telegram Bot**: Created via BotFather.
2. **Airtable Base**: Setup with specific tables (see `airtable_schema.json`).
3. **OpenAI API Key**.
4. **n8n Instance**: With Telegram, Airtable, and OpenAI credentials configured.

## Workflows
1. **WF1 - Intake**: Handles incoming messages (text, voice, photo), parses data, and updates Airtable or asks for clarification.
2. **WF2 - Clarification Resolver**: Handles user responses to clarifications.
3. **WF3 - Status**: Returns daily nutrition status.

## Setup Instructions
1. Create the Airtable Base using the structure in `airtable_schema.json`.
2. Import the workflow JSON files into n8n.
3. Configure credentials in n8n for Telegram, Airtable, and OpenAI.
4. Set n8n timezone to `Europe/Berlin`.
