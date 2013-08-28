arrx
====

This is ArrX.
It is a micro (?) js library that is designed for my personal use (but you're free to modify/use it).

I aimed to keep it extremely slenderby relying heavily on modern ECMAScript standards at the expense of old/obscure browser support. Some design paradigms are similar to what you'd find in jQuery. This is because I converted my old libraries to this design style afterreading John Resig's excellent book "Secrets of the JavaScript Ninja."

I'm a fan of jQuery's prototyping elegance, and have retained its design paradigm in three respects:
1. Object instantiation via prototype -- this leaves a very small memory footprint (good practice!)
2. The return object structure -- which is actually just built-in native map objects "spoofed" as arrays.
3. The .extend and .fn.extend flexibility (Retained so as not to bloat the library with site-specific code).

Past this, I've introduced a substantial amount of my own (old) functionality that has been brought in line with this new format.

This library is not as fully-featured as jQuery, and I obviously can't recommend using it in a production environment. It is designed for and used on my website.

http://www.sberry.me/
