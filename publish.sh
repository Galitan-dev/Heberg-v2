git add -A
git commit -m "$*"
git push
ssh ethan@galitan.tk "sudo -S systemctl restart heberg" <<!
Dm3qtdno8dCyXLbq
!
ssh ethan@galitan.tk "cd \$HOME/heberg/app/scripts && chmod u+x \$(ls)"