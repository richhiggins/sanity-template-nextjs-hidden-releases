import {ReleaseDocument, useClient, type ReleaseActionComponent} from 'sanity'
import {EyeClosedIcon, EyeOpenIcon} from '@sanity/icons'

type ReleaseMetadataWithHidden = NonNullable<ReleaseDocument['metadata']> & {
  hidden?: boolean
}

export const HideReleaseAction: ReleaseActionComponent = ({release}) => {
  const client = useClient({
    apiVersion: '2025-11-27',
  })

  const metadata = release.metadata as ReleaseMetadataWithHidden | undefined
  const isHidden = metadata?.hidden === true

  return {
    label: isHidden ? 'Unhide release' : 'Hide release',
    icon: isHidden ? EyeOpenIcon : EyeClosedIcon,
    onHandle: async () => {
      const nextHidden = isHidden ? false : true
      client
        .action({
          actionType: 'sanity.action.release.edit',
          releaseId: release._id.split('releases.')[1],
          patch: {
            set: {
              metadata: {
                ...release.metadata,
                hidden: nextHidden,
              },
            },
          },
        })
        .then(() => {
          console.log(`Release metadata was updated to 'hidden:${nextHidden}`)
          // UX enhancement: trigger a toast notification here
        })
        .catch((err) => {
          console.error('Edit release update failed: ', err.message)
        })
    },
  }
}
