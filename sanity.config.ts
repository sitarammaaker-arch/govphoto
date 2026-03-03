import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SignResizer Blog',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: 'production',
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
