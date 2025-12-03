// Prototype component for tagging 'hidden' images
import {FormPatch, ImageInputProps, PatchEvent, useClient, usePerspective} from 'sanity'

export const HiddenImageInput = (props: ImageInputProps) => {
  const {renderDefault, onChange} = props
  const client = useClient({apiVersion: 'v2023-08-22'})
  const perspective = usePerspective()

  //overwrite the default onChange function
  const handleChange = async (patches: FormPatch | FormPatch[] | PatchEvent) => {
    //first, just do the default action given to us by the component
    onChange(patches)
    //always handle patches as an array
    const patchesToImage = Array.isArray(patches) ? patches : [patches]
    const assetId = patchesToImage.find(
      //@ts-ignore for the type overload
      (patch: FormPatch) =>
        patch.path && patch.path[0] == 'asset' && patch.type == 'set' && patch?.value?._ref,
    )?.value?._ref

    //don't do anything if there is no asset
    if (!assetId) return

    await client
      // @ts-ignore
      .fetch(`*[_id == "${perspective.selectedPerspective._id}"][0]`)
      .then(async (perspective) => {
        if (perspective?.metadata?.hidden)
          await client
            .patch(assetId)
            // `hidden` for simple filtering, `hiddenBy` for simple lookup/update
            .setIfMissing({hidden: true, hiddenBy: perspective._id})
            .commit()
            .then(console.log)
            .catch(console.error)
      })
  }
  return renderDefault({...props, onChange: handleChange})
}
