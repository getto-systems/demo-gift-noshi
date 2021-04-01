DOCKER_WRAPPER_IMAGE_node(){ head -1 $APP_ROOT/.gitlab-ci.yml | sed "s/.*node:\(.*\)/\1/"; }
DOCKER_WRAPPER_IMAGE_debian(){ echo "buster"; }
DOCKER_WRAPPER_IMAGE_tex(){ echo "demo/gift-noshi:dev"; }

DOCKER_WRAPPER_APP(){
  case $1 in
    public)
      command=$2
      if [ -z "$command" ]; then
        command=restart
      fi
      npm-server $1 "$command" npm run start:$1
      ;;
    *)
      case $1 in
        *start)
          node-run npm run setup
          ;;
      esac
      npm-server public $1 npm run start:public
      ;;
  esac
}
DOCKER_WRAPPER_SERVER_OPTS_public(){ echo "-p ${LABO_PORT_PREFIX}${PUBLIC_PORT}:${PUBLIC_APP_PORT}"; }
