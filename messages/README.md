Dylan Hoffmann
Comp 20 Summer Session A 2017
Lab 9: Messages
1) To my knowledge all aspects are implemented correctly. However, there was a minor issue in instructions 2, where for Iceweasel (the default web browser for the VM) I could access the local file when opened from the local machine, but from chrome I couldn't
2) I did not collaborate with anyone on this lab.
3) This lab took approximately an hour
4) It is seemingly is possible to request data from a different origin using XMLHttpRequest, which I am still trying to understand how with regard to the same-origin policy. However, when I switch the request to the messagehub link, I can access the JSON in both chrome and iceweasel both with and without the local host. I can request local files through iceweasel when not runningthe local host, but not through chrome, furthering my confusion about how exactly the smae-origin policy works. From my further reading I originally suspected it may have had to do with something called gecko, but that doesn't make sense because data.json and index.html are in the same directory, which should be considered same-origin.
