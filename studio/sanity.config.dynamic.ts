/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig, ImageInputProps} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemaTypes'
import {preLaunchStructure, structure} from './src/structure'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import {assist} from '@sanity/assist'
import {createClient} from '@sanity/client'
import {HideReleaseAction} from './actions'
import {HiddenImageInput} from './components/hiddenImageInput'
import {media} from 'sanity-plugin-media'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// Define the home location for the presentation tool
const homeLocation = {
  title: 'Home',
  href: '/',
} satisfies DocumentLocation

// resolveHref() is a convenience function that resolves the URL
// path for different document types and used in the presentation tool.
function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/posts/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}

// top level client to fetch and log out the current user
const client = createClient({
  projectId: '87n0gy59',
  dataset: 'production',
  useCdn: true, // Set to false to bypass the edge cache
  apiVersion: '2025-02-06', // Use current date (YYYY-MM-DD)
})

const currentUser = await client.request({
  uri: '/users/me',
  withCredentials: true,
})

// console.log(currentUser)

let config = [
  {
    name: 'default',
    title: 'Tempo - Live',
    basePath: '/live',
    projectId,
    dataset,

    plugins: [
      structureTool({
        structure, // Live workspace structure configuration, imported from ./src/structure.ts
      }),
      // Presentation tool configuration for Visual Editing
      presentationTool({
        previewUrl: {
          origin: SANITY_STUDIO_PREVIEW_URL,
          previewMode: {
            enable: '/api/draft-mode/enable',
          },
        },
        resolve: {
          // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
          mainDocuments: defineDocuments([
            {
              route: '/',
              filter: `_type == "settings" && _id == "siteSettings"`,
            },
            {
              route: '/:slug',
              filter: `_type == "page" && slug.current == $slug || _id == $slug`,
            },
            {
              route: '/posts/:slug',
              filter: `_type == "post" && slug.current == $slug || _id == $slug`,
            },
          ]),
          // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
          locations: {
            settings: defineLocations({
              locations: [homeLocation],
              message: 'This document is used on all pages',
              tone: 'positive',
            }),
            page: defineLocations({
              select: {
                name: 'name',
                slug: 'slug.current',
              },
              resolve: (doc) => ({
                locations: [
                  {
                    title: doc?.name || 'Untitled',
                    href: resolveHref('page', doc?.slug)!,
                  },
                ],
              }),
            }),
            post: defineLocations({
              select: {
                title: 'title',
                slug: 'slug.current',
              },
              resolve: (doc) => ({
                locations: [
                  {
                    title: doc?.title || 'Untitled',
                    href: resolveHref('post', doc?.slug)!,
                  },
                  {
                    title: 'Home',
                    href: '/',
                  } satisfies DocumentLocation,
                ].filter(Boolean) as DocumentLocation[],
              }),
            }),
          },
        },
      }),
      // Additional plugins for enhanced functionality
      assist(),
      visionTool(),
      media(),
    ],

    // Schema configuration, imported from ./src/schemaTypes/index.ts
    schema: {
      types: schemaTypes,
    },
    releases: {
      actions: currentUser.role === 'administrator' ? [HideReleaseAction] : [],
    },
    document: {
      drafts: {
        // might be desirable to disable drafts TBD
        enabled: true,
      },
    },
    form: {
      components: {
        input: (props: ImageInputProps) => {
          if (props.schemaType.name === 'image') {
            return HiddenImageInput(props)
          }
          //if we're not in an image, just do the default action
          return props.renderDefault(props)
        },
      },
    },
  },
]

const launchConfig = {
  name: 'launch',
  title: 'Tempo - Album Launch',
  basePath: '/launch',
  projectId,
  dataset,

  plugins: [
    structureTool({
      // Album launch workspace structure configuration, imported from ./src/structure.ts
      structure: preLaunchStructure,
    }),
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // The Main Document Resolver API provides a method of resolving a main document from a given route or route pattern. https://www.sanity.io/docs/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "settings" && _id == "siteSettings"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/posts/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        // Locations Resolver API allows you to define where data is being used in your application. https://www.sanity.io/docs/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          page: defineLocations({
            select: {
              name: 'name',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          post: defineLocations({
            select: {
              title: 'title',
              slug: 'slug.current',
            },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('post', doc?.slug)!,
                },
                {
                  title: 'Home',
                  href: '/',
                } satisfies DocumentLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    // Additional plugins for enhanced functionality
    assist(),
    visionTool(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
    templates: () => [
      {
        id: 'post',
        title: 'Pre-Launch Post',
        schemaType: 'post',
        value: {
          preLaunch: true,
        },
      },
      {
        id: 'page',
        title: 'Pre-Launch Page',
        schemaType: 'page',
        value: {
          preLaunch: true,
        },
      },
      {
        id: 'person',
        title: 'Pre-Launch Person',
        schemaType: 'person',
        value: {
          preLaunch: true,
        },
      },
      /*{
        id: 'release',
        title: 'Pre-Launch Content Release',
        schemaType: 'system.release',
        value: {
          preLaunch: true,
        },
      },*/
      // add & test content releases initial value template
    ],
  },
}

//if (currentUser.role === 'administrator') {
//  config.push(launchConfig)
//}

export default defineConfig(config[0])
