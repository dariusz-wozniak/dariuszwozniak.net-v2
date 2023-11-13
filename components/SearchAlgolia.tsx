'use client'

import algoliasearch from 'algoliasearch/lite'
import { AlgoliaHit } from 'instantsearch.js'
import React from 'react'
import { InstantSearch, Hits, SearchBox, Highlight } from 'react-instantsearch-dom'

const client = algoliasearch('C68MF7P5PG', 'a3fdb060730fbe363a78e2e6c9523665')

type HitProps = {
  hit: AlgoliaHit<{
    title: string
  }>
}

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="title" />
      <span>{hit.title}</span>
    </>
  )
}

export default function SearchAlgolia() {
  return (
    <InstantSearch indexName="dariuszwozniaknet" searchClient={client}>
      <SearchBox />
      <Hits hitComponent={Hit} />
    </InstantSearch>
  )
}
