# Event: Document create/update (is this all that is needed?)

// is this document inside a release & did the image field change

\*[_id in path("versions.**") && delta(image field TODO)]

    e.g. \_id:versions.rSnTao3PB.08461ac1-5535-4b25-a333-12ae2477b3af

    then, substring & lookup release with id rSnTao3PB

        // is this a hidden release

        *[\_id match "*rSnTao3PB\*" && metadata.hidden]

            then > use client to add a hidden tag to the reference image
