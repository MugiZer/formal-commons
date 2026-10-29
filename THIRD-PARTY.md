# Interface sources

- The application layout, density and typography follow [Hugging Face Hub](https://huggingface.co/models), as requested. No Hugging Face product logo, user data or proprietary application code is included.
- Buttons, inputs, textareas, tabs, dialogs, sheets, menus and labels are generated from [shadcn/ui](https://github.com/shadcn-ui/ui), using its New York component source and Radix primitives. Ohara applies shared Hub-style tokens and Primer icons.
- Source Sans Pro and IBM Plex Mono are self-hosted through Fontsource. These are the font families observed in Hugging Face's rendered interface on 24 October 2026. Their packages include the SIL Open Font License.
- Functional icons come from [Primer Octicons](https://github.com/primer/octicons) under the MIT license.
- Client marks in `site/public/agents/` are the light/dark identifier assets used by [Cloudflare Agent setup](https://developers.cloudflare.com/agent-setup/). They identify Codex, Claude, Cursor and Visual Studio Code; their respective owners retain trademark rights. Asset sources are `https://developers.cloudflare.com/icons/agents/{codex,claude,cursor,visual-studio-code}/{light,dark}.svg`.
- Account/session handling uses [Better Auth](https://github.com/better-auth/better-auth), under the MIT license. Password hashing and OAuth handling are delegated to that library.

## shadcn/ui license

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
