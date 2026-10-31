# About this fixture

The second private repository in the Phase 3 live matrix. Plain Markdown, no
raw HTML and no MDX -- the contract allows `.json`, `.md`, `.yaml` and `.yml`
inside `content/`, and nothing else.

`showHero` is `true` here and `false` on the first fixture. That difference is
load-bearing: a matrix row that claims to have run against both sites and
actually ran twice against one would report identical settings for both.
