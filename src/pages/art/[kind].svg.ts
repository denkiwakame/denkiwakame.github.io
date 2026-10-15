import type { APIRoute, GetStaticPaths } from 'astro';
import { ART_KINDS, buildArt, type ArtKind } from '../../lib/art';

export const getStaticPaths = (() => ART_KINDS.map((kind) => ({ params: { kind } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(buildArt(params.kind as ArtKind), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
