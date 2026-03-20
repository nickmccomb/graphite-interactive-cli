# bash completion for gtm (graphite-interactive-cli)
# shellcheck shell=bash
# Install: source path/to/gtm.bash (or copy to /etc/bash_completion.d/)

_gtm() {
  local cur=${COMP_WORDS[COMP_CWORD]}
  if [[ ${COMP_CWORD} -eq 1 ]]; then
    COMPREPLY=($(compgen -W "doctor raw help --help -h --version -v --doctor --cwd -C --" -- "$cur"))
    return
  fi
}
complete -F _gtm gtm
