workflow "License validation flow" {
  on = "pull_request"
  resolves = ["validate license"]
}

action "validate license" {
  uses = "datreeio/validate-license-action@master"
  args = ["MIT"]
}
