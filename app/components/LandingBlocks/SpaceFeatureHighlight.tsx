import React from 'react'
import Image from 'next/image'
import SpaceFeature from '../../../public/images/space-feature.png'

const SpaceFeatureHighlight = () => {
  return (
    <section className='mx-auto max-w-7xl'>
        <div>
            <Image
                src={SpaceFeature}
                alt="Space Feature"
                className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition duration-300"
            />
        </div>
    </section>
  )
}

export default SpaceFeatureHighlight
