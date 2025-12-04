import {ALL_FIELDS_GROUP, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'
import HiddenBooleanInput from '../../../components/hiddenBooleanInput'
import HiddenByInput from '../../../components/hiddenByInput'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Landing Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'editorial',
      title: 'Editorial',
    },
    {
      name: 'access',
      title: 'Access',
    },
    {
      ...ALL_FIELDS_GROUP,
      hidden: true,
    },
  ],
  fields: [
    defineField({
      name: 'preLaunch',
      title: 'Pre-Launch',
      type: 'boolean',
      hidden: ({value}) => value !== true, // renders a bit janky
      readOnly: true,
    }),
    defineField({
      name: 'hiddenBy',
      type: 'string',
      components: {
        input: HiddenByInput,
      },
      group: 'access',
      hidden: ({currentUser}) => {
        return !currentUser?.roles?.find?.(({name}) => name === 'administrator')
      },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
      group: 'editorial',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      //      validation: (Rule) => Rule.required(),
      group: 'editorial',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      group: 'editorial',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [{type: 'callToAction'}, {type: 'infoSection'}],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
      group: 'editorial',
    }),
  ],
})
