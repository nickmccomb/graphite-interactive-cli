#compdef gtm
# Add completions/ to fpath, then: autoload -Uz compinit && compinit

_arguments \
  '-C+[Working directory for all gt calls]:directory:_directories' \
  '--cwd=[Working directory for all gt calls]:directory:_directories' \
  '1:subcommand:(doctor raw help)'
